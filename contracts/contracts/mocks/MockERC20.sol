//SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {

    constructor(
        string memory name,
        string memory symbol,
        uint8 _decimals
    ) public ERC20(name, symbol) {
        _setupDecimals(_decimals);
    }


    function faucet() public {
        _mint(msg.sender, 10000 * (10 ** uint256(decimals())));
    }

    function deposit(uint256 _amount) public payable {
        
    }   

    function withdraw(uint256 _amount) public {

    }

}