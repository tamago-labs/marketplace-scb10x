import React, { useState, useContext, useEffect, useCallback } from "react";
import Modal from "react-bootstrap/Modal";
import { ShoppingCart, ArrowRight } from "react-feather";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { Puff } from "react-loading-icons";

import { Button } from "../button";
import { NftCartsContext } from "../../hooks/useNftCarts";
import ERC721ABI from "../../abi/ERC721.json";
import ERC1155ABI from "../../abi/ERC1155.json";
import ERC20ABI from "../../abi/erc20.json";
import { NFT_MARKETPLACE } from "../../constants";
import useOrder from "../../hooks/useOrder";

/** Styled-Components */
const Preview = styled.div`
  display: flex;
  color: #333;
  div {
    flex: 1;
    width: 150px;
    border-radius: 12px;
    padding: 12px;
    border: 1px solid transparent;
    margin-left: 3px;
    margin-right: 3px;
    display: flex;
  }
`;

const SwapButton = styled.button.attrs(() => ({ className: "btn" }))`
  color: #ffffff;
  background: #7a0bc0;
  font-weight: 600;
  border-radius: 32px;
  border: 2px solid transparent;
  width: 100%;
  max-width: 300px;
  cursor: pointer;

  :hover {
    color: #ffffff;
    background: #fa58b6;
  }
`;

const NumDot = styled.div`
  display: flex; 
  margin-left: 7px;
  padding: 1px 5px;
  background-color: #000;
  color: #ffff;
  border-radius: 50px;
`;

const Container = styled.div`
  display: flex;
  margin-left: 10px;
`

/** Function */
const CartModal = ({ chainId }) => {
  const [show, setShow] = useState(false);
  const [cartListNum, setCartListNum] = useState();
  const [tick, setTick] = useState();
  const [loading, setLoading] = useState();
  const [isApprovedAll, setIsApprovedAll] = useState(false);
  const [orderIdList, setOrderIdList] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [tokenIndexList, setTokenIndexList] = useState([]);

  const { cartList, setCartList } = useContext(NftCartsContext);
  const { account, library } = useWeb3React();
  const { swapBatch } = useOrder();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleClearAll = useCallback(() => {
    localStorage.clear();
    setCartList([]);
    setOrderIdList([]);
    setOrderList([]);
    setTokenIndexList([]);
  }, []);

  //change chain handle
  // useEffect(() => {
  //   localStorage.clear();
  //   setCartList([]);
  // }, [chainId]);

  useEffect(() => {
    setCartListNum(cartList.length);
    console.log(
      "🚀 ~ file: cartModal.js ~ line 66 ~ CartModal ~ cartList",
      cartList
    );
  }, [cartList]);

  useEffect(() => {
    console.log(
      "🚀 ~ file: cartModal.js ~ line 108 ~ CartModal ~ orderIdList",
      orderIdList
    );
    console.log(orderList);
  }, [orderIdList]);

  const increaseTick = useCallback(() => {
    setTick(tick + 1);
  }, [tick]);

  const onApprove = useCallback(async () => {
    setLoading(true);
    const { contractAddress } = NFT_MARKETPLACE.find(
      (item) => item.chainId === chainId
    );

    //initial before swap batch
    const orderIdArr = [];
    const orderArr = [];
    const tokenIndexArr = [];
    cartList.map((cartItem) => {
      orderIdArr.push(cartItem.orderId);
      orderArr.push(cartItem.order);
      tokenIndexArr.push(cartItem.item.index);
    });
    setOrderIdList(orderIdArr);
    setOrderList(orderArr);
    setTokenIndexList(tokenIndexArr);

    let assetAddressSet = new Set();
    try {
      await Promise.all(
        cartList.map(async (cartItem) => {
          const item = cartItem.item;
          console.log(
            "🚀 ~ file: cartModal.js ~ line 97 ~ cartList.map ~ cartItem.approved",
            cartItem.approved
          );
          if (
            !assetAddressSet.has(item.assetAddress) &&
            cartItem.approved === false
          ) {
            assetAddressSet.add(item.assetAddress);

            if (item.tokenType === 0) {
              console.log("erc20");
              const erc20 = new ethers.Contract(
                item.assetAddress,
                ERC20ABI,
                library.getSigner()
              );
              await erc20.approve(contractAddress, ethers.constants.MaxUint256);
            }

            if (item.tokenType === 1) {
              console.log("erc721");

              const erc721 = new ethers.Contract(
                item.assetAddress,
                ERC721ABI,
                library.getSigner()
              );

              await erc721.setApprovalForAll(contractAddress, true);
            }

            if (item.tokenType === 2) {
              console.log("erc1155");

              const erc1155 = new ethers.Contract(
                item.assetAddress,
                ERC1155ABI,
                library.getSigner()
              );

              await erc1155.setApprovalForAll(contractAddress, true);
            }
          }
        })
      );
      setIsApprovedAll(true);
    } catch (e) {
      console.log(e.message);
    }

    setTick(tick + 1);
    setLoading(false);
  }, [cartList, tick]);

  const onSwap = useCallback(async () => {
    setLoading(true);
    try {
      const tx = await swapBatch(orderIdList, orderList, tokenIndexList);
      await tx.wait();
    } catch (e) {
      console.log(e, e.error);

      const message =
        e.error && e.error.data && e.error.data.message
          ? e.error.data.message
          : e.message;
    }
    setLoading(false);
    increaseTick();
  }, [cartList]);

  return (
    <Container>
      <Button variant="primary" onClick={handleShow}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <ShoppingCart />
          <NumDot>{cartListNum}</NumDot>
        </div>
      </Button>

      <Modal show={show} onHide={handleClose} style={{ color: "#000" }}>
        <Modal.Header closeButton>
          <Modal.Title>
            Your NFT Shopping Cart
            <Button onClick={handleClearAll}>clear all</Button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cartList.map((cartItem, index) => {
            return (
              <Preview key={index}>
                <div>
                  {cartItem.item && cartItem.item.tokenType === 0 && (
                    <>
                      <img
                        src={"../images/coin.png"}
                        width="100%"
                        height="120px"
                        style={{ margin: "auto" }}
                      />

                      <p>{cartItem.item.symbol}</p>
                    </>
                  )}
                  {cartItem.pairMetadata && (
                    <img
                      src={cartItem.pairMetadata.metadata.image}
                      width="100%"
                      height="120px"
                      style={{ margin: "auto" }}
                    />
                  )}
                </div>
                <div>
                  <div style={{ margin: "auto", textAlign: "center" }}>
                    <ArrowRight
                      style={{ marginLeft: "auto", marginRight: "auto" }}
                      size={32}
                    />
                  </div>
                </div>
                <div>
                  {cartItem.baseMetadata ? (
                    <img
                      src={cartItem.baseMetadata.metadata.image}
                      width="100%"
                      height="120px"
                      style={{ margin: "auto" }}
                    />
                  ) : (
                    <>
                      {/* <p>{cartItem.item.symbol}</p> */}
                      <img
                        src={"../images/coin.png"}
                        width="100%"
                        height="120px"
                        style={{ margin: "auto" }}
                      />
                    </>
                  )}
                </div>
              </Preview>
            );
          })}
          <hr style={{ background: "#333" }} />

          <div className="text-center">
            {isApprovedAll ? (
              <SwapButton variant="primary" onClick={onSwap}>
                {loading && (
                  <Puff
                    height="24px"
                    style={{ marginRight: "5px" }}
                    stroke="white"
                    width="24px"
                  />
                )}
                Swap
              </SwapButton>
            ) : (
              <SwapButton variant="primary" onClick={onApprove}>
                {loading && (
                  <Puff
                    height="24px"
                    style={{ marginRight: "5px" }}
                    stroke="white"
                    width="24px"
                  />
                )}
                Approve
              </SwapButton>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CartModal;
