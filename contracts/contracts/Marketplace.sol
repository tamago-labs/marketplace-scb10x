// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/introspection/ERC165.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155Holder.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./interfaces/IGateway.sol";

/**
 * @title Multi-Chain Marketplace
 */

contract Marketplace is
    ReentrancyGuard,
    IERC721Receiver,
    ERC165,
    ERC721Holder,
    ERC1155Holder,
    Pausable
{
    using Address for address;
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    enum Role {
        UNAUTHORIZED,
        ADMIN
    }

    enum TokenType {
        ERC20,
        ERC721,
        ERC1155
    }

    struct Order {
        address assetAddress;
        uint256 tokenId;
        bool is1155;
        address owner;
        bytes32 root;
        bool canceled;
        bool ended;
        bool active;
    }

    // order that's half-fulfilled at destination chain
    struct PartialOrder {
        bool active;
        bool ended;
        address buyer;
        address assetAddress;
        uint256 tokenIdOrAmount;
        TokenType tokenType;
    }

    // ACL
    mapping(address => Role) private permissions;
    // Gateway contract
    IGateway private gateway;
    // Fees (when claim with ERC-20)
    uint256 public swapFee;
    // Dev address
    address public devAddress;
    // Order Id => Order
    mapping(uint256 => Order) public orders;
    // Partially fulfilled orders (orderId -> struct)
    mapping(uint256 => PartialOrder) public partialOrders;

    event OrderCreated(
        uint256 indexed orderId,
        address assetAddress,
        uint256 tokenId,
        bool is1155,
        address owner,
        bytes32 root
    );

    event OrderCanceled(uint256 indexed orderId, address owner);
    event Swapped(uint256 indexed orderId, address fromAddress);
    event PartialSwapped(uint256 indexed orderId, address fromAddress);
    event Claimed(uint256 indexed orderId, address fromAddress, bool isOriginChain);

    constructor(address _devAddress, address _gatewayAddress) public {
        gateway = IGateway(_gatewayAddress);
        devAddress = _devAddress;

        permissions[_devAddress] = Role.ADMIN;

        if (_devAddress != msg.sender) {
            permissions[msg.sender] = Role.ADMIN;
        }

        // set default fees
        swapFee = 100; // 1%

        _registerInterface(IERC721Receiver.onERC721Received.selector);
    }

    // create an order
    function create(
        uint256 _orderId,
        address _assetAddress,
        uint256 _tokenId,
        bool _is1155,
        bytes32 _root
    ) external nonReentrant whenNotPaused {
        _create(_orderId, _assetAddress, _tokenId, _is1155, _root);

        emit OrderCreated(
            _orderId,
            _assetAddress,
            _tokenId,
            _is1155,
            msg.sender,
            _root
        );
    }

    // cancel
    function cancel(uint256 _orderId) external whenNotPaused nonReentrant {
        require(orders[_orderId].active == true, "Given ID is invalid");
        require(orders[_orderId].owner == msg.sender, "You are not the owner");

        TokenType currentType = TokenType.ERC721;

        if (orders[_orderId].is1155 == true) {
            currentType = TokenType.ERC1155;
        }

        _give(
            orders[_orderId].assetAddress,
            orders[_orderId].tokenId,
            currentType,
            msg.sender
        );

        orders[_orderId].canceled = true;
        orders[_orderId].ended = true;

        emit OrderCanceled(_orderId, msg.sender);
    }

    // intra-chain swaps
    function swap(
        uint256 _orderId,
        address _assetAddress,
        uint256 _tokenIdOrAmount,
        TokenType _type,
        bytes32[] memory _proof
    ) external validateId(_orderId) whenNotPaused nonReentrant {
        _swap(_orderId, _assetAddress, _tokenIdOrAmount, _type, _proof);

        emit Swapped(_orderId, msg.sender);
    }

    // cross-chain swaps, deposit the NFT on the destination chain and wait for the validator to approve the claim
    function partialSwap(
        uint256 _orderId,
        address _assetAddress,
        uint256 _tokenIdOrAmount,
        TokenType _type,
        bytes32[] memory _proof
    ) external whenNotPaused nonReentrant {
        _partialSwap(_orderId, _assetAddress, _tokenIdOrAmount, _type, _proof);

        emit PartialSwapped(_orderId, msg.sender);
    }

    // check whether can do intra-chain swaps
    function eligibleToSwap(
        uint256 _orderId,
        address _assetAddress,
        uint256 _tokenIdOrAmount,
        bytes32[] memory _proof
    ) external view validateId(_orderId) returns (bool) {
        return
            _eligibleToSwap(_orderId, _assetAddress, _tokenIdOrAmount, _proof);
    }

    // check if the caller can claim the NFT (that approved by the validator )
    function eligibleToClaim(
        uint256 _orderId,
        address _claimer,
        bool _isOriginChain,
        bytes32[] memory _proof
    ) external view returns (bool) {
        return _eligibleToClaim(_orderId, _claimer, _isOriginChain, _proof);
    }

    // check if the caller can deposit the nft
    function eligibleToPartialSwap(
        uint256 _orderId,
        address _assetAddress,
        uint256 _tokenIdOrAmount,
        bytes32[] memory _proof
    ) external view returns (bool) {
        return
            _eligibleToPartialSwap(
                _orderId,
                _assetAddress,
                _tokenIdOrAmount,
                _proof
            );
    }

    // claim the NFT (that approved by the validator )
    function claim(
        uint256 _orderId,
        bool _isOriginChain,
        bytes32[] memory _proof
    ) external whenNotPaused nonReentrant {
        require(
            _eligibleToClaim(_orderId, msg.sender, _isOriginChain, _proof) ==
                true,
            "The caller is not eligible to claim the NFT"
        );

        // giving NFT
        if (_isOriginChain == true) {
            TokenType nftType = TokenType.ERC721;
            if (orders[_orderId].is1155 == true) {
                nftType = TokenType.ERC1155;
            }
            _give(
                orders[_orderId].assetAddress,
                orders[_orderId].tokenId,
                nftType,
                msg.sender
            );

            orders[_orderId].ended = true;
        } else {
            _give(
                partialOrders[_orderId].assetAddress,
                partialOrders[_orderId].tokenIdOrAmount,
                partialOrders[_orderId].tokenType,
                msg.sender
            );

            partialOrders[_orderId].ended = true;
        }

        emit Claimed( _orderId, msg.sender, _isOriginChain );
    }

    // ADMIN FUNCTIONS

    // give a specific permission to the given address
    function grant(address _address, Role _role) external onlyAdmin {
        require(_address != msg.sender, "You cannot grant yourself");
        permissions[_address] = _role;
    }

    // remove any permission binded to the given address
    function revoke(address _address) external onlyAdmin {
        require(_address != msg.sender, "You cannot revoke yourself");
        permissions[_address] = Role.UNAUTHORIZED;
    }

    // pause the contract
    function setPaused() external onlyAdmin whenNotPaused {
        _pause();
    }

    // unpause the contract
    function setUnpaused() external onlyAdmin whenPaused {
        _unpause();
    }

    // update dev address
    function setDevAddress(address _devAddress) external onlyAdmin {
        devAddress = _devAddress;
    }

    // update swap fees
    function setSwapFee(uint256 _fee) external onlyAdmin {
        swapFee = _fee;
    }

    // only admin can cancel the partial swap 
    function cancelPartialSwap(uint256 _orderId, address _to)
        external
        onlyAdmin
        nonReentrant
    {
        require(partialOrders[_orderId].active == true, "Invalid order");

        _give(
            partialOrders[_orderId].assetAddress,
            partialOrders[_orderId].tokenIdOrAmount,
            partialOrders[_orderId].tokenType,
            _to
        );

        partialOrders[_orderId].active = false;
    }

    


    // INTERNAL FUCNTIONS

    modifier onlyAdmin() {
        require(
            permissions[msg.sender] == Role.ADMIN,
            "Caller is not the admin"
        );
        _;
    }

    modifier validateId(uint256 _orderId) {
        require(orders[_orderId].active == true, "Given ID is invalid");
        require(
            orders[_orderId].canceled == false,
            "The order has been cancelled"
        );
        require(
            orders[_orderId].ended == false,
            "The order has been fulfilled"
        );
        _;
    }

    function _create(
        uint256 _orderId,
        address _assetAddress,
        uint256 _tokenId,
        bool _is1155,
        bytes32 _root
    ) internal {
        require(orders[_orderId].active == false, "Given ID is occupied");

        orders[_orderId].active = true;
        orders[_orderId].assetAddress = _assetAddress;
        orders[_orderId].tokenId = _tokenId;
        orders[_orderId].is1155 = _is1155;
        orders[_orderId].root = _root;
        orders[_orderId].owner = msg.sender;

        TokenType currentType = TokenType.ERC721;

        if (_is1155) {
            currentType = TokenType.ERC1155;
        }

        _take(_assetAddress, _tokenId, currentType, address(this));
    }

    function _swap(
        uint256 _orderId,
        address _assetAddress,
        uint256 _tokenId,
        TokenType _type,
        bytes32[] memory _proof
    ) internal {
        require(
            _eligibleToSwap(_orderId, _assetAddress, _tokenId, _proof) == true,
            "The caller is not eligible to claim the NFT"
        );

        // taking NFT
        _take(_assetAddress, _tokenId, _type, orders[_orderId].owner);

        // giving NFT
        TokenType nftType = TokenType.ERC721;
        if (orders[_orderId].is1155 == true) {
            nftType = TokenType.ERC1155;
        }
        _give(
            orders[_orderId].assetAddress,
            orders[_orderId].tokenId,
            nftType,
            msg.sender
        );

        orders[_orderId].ended = true;
    }

    function _partialSwap(
        uint256 _orderId,
        address _assetAddress,
        uint256 _tokenIdOrAmount,
        TokenType _type,
        bytes32[] memory _proof
    ) internal {
        require(
            partialOrders[_orderId].active == false,
            "The order is already active"
        );
        require(
            _eligibleToPartialSwap(
                _orderId,
                _assetAddress,
                _tokenIdOrAmount,
                _proof
            ) == true,
            "The caller is not eligible to claim the NFT"
        );

        // deposit NFT or tokens until the NFT locked in the origin chain is being transfered to the buyer
        _take(_assetAddress, _tokenIdOrAmount, _type, address(this));

        partialOrders[_orderId].active = true;
        partialOrders[_orderId].buyer = msg.sender;
        partialOrders[_orderId].assetAddress = _assetAddress;
        partialOrders[_orderId].tokenIdOrAmount = _tokenIdOrAmount;
        partialOrders[_orderId].tokenType = _type;
    }

    function _eligibleToSwap(
        uint256 _orderId,
        address _assetAddress,
        uint256 _tokenIdOrAmount,
        bytes32[] memory _proof
    ) internal view returns (bool) { 
        bytes32 leaf = keccak256(
            abi.encodePacked(_assetAddress, _tokenIdOrAmount)
        );
        return MerkleProof.verify(_proof, orders[_orderId].root, leaf);
    }

    function _eligibleToPartialSwap(
        uint256 _orderId,
        address _assetAddress,
        uint256 _tokenIdOrAmount,
        bytes32[] memory _proof
    ) internal view returns (bool) {
        bytes32 leaf = keccak256(
            abi.encodePacked(
                _orderId,
                gateway.chainId(),
                _assetAddress,
                _tokenIdOrAmount
            )
        );
        return MerkleProof.verify(_proof, gateway.relayRoot(), leaf);
    }

    function _eligibleToClaim(
        uint256 _orderId,
        address _claimer,
        bool _isOriginChain,
        bytes32[] memory _proof
    ) internal view returns (bool) {
        bytes32 leaf = keccak256(
            abi.encodePacked(
                _orderId,
                gateway.chainId(),
                _claimer,
                _isOriginChain
            )
        );
        return MerkleProof.verify(_proof, gateway.claimRoot(), leaf);
    }

    function _take(
        address _assetAddress,
        uint256 _tokenIdOrAmount,
        TokenType _type,
        address _to
    ) internal {
        if (_type == TokenType.ERC1155) {
            IERC1155(_assetAddress).safeTransferFrom(
                msg.sender,
                _to,
                _tokenIdOrAmount,
                1,
                "0x00"
            );
        } else if (_type == TokenType.ERC721) {
            IERC721(_assetAddress).safeTransferFrom(
                msg.sender,
                _to,
                _tokenIdOrAmount
            );
        } else {
            // taking swap fees
            if (swapFee != 0) {
                uint256 fee = _tokenIdOrAmount.mul(swapFee).div(10000);
                IERC20(_assetAddress).safeTransferFrom(
                    msg.sender,
                    devAddress,
                    fee
                );
            }

            IERC20(_assetAddress).safeTransferFrom(
                msg.sender,
                _to,
                _tokenIdOrAmount
            );
        }
    }

    function _give(
        address _assetAddress,
        uint256 _tokenIdOrAmount,
        TokenType _type,
        address _to
    ) internal {
        if (_type == TokenType.ERC1155) {
            IERC1155(_assetAddress).safeTransferFrom(
                address(this),
                _to,
                _tokenIdOrAmount,
                1,
                "0x00"
            );
        } else if (_type == TokenType.ERC721) {
            IERC721(_assetAddress).safeTransferFrom(
                address(this),
                _to,
                _tokenIdOrAmount
            );
        } else {
            IERC20(_assetAddress).safeTransfer(
                msg.sender,
                _tokenIdOrAmount
            );
        }
    }
}
