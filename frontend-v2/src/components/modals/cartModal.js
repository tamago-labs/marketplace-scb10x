import React, { useState, useContext, useEffect, useCallback } from "react";
import Modal from "react-bootstrap/Modal";
import { ShoppingCart, ArrowRight } from "react-feather";
import styled from "styled-components";
import { Button } from "../button";
import { NftCartsContext } from "../../hooks/useNftCarts";

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

const RedDot = styled.div`
  position: relative;
  left: 15px;
  bottom: 5px;
  background-color: #000;
  color: #ffff;
  border-radius: 50px;
`;

const CartModal = ({ chainId }) => {
  const [show, setShow] = useState(false);
  const [cartListNum, setCartListNum] = useState();

  const { cartList, setCartList } = useContext(NftCartsContext);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleClearAll = useCallback(() => {
    localStorage.clear();
    setCartList([]);
  }, []);

  //change chain handle
  useEffect(() => {
    localStorage.clear();
    setCartList([]);
  }, [chainId]);

  useEffect(() => {
    setCartListNum(cartList.length);
  }, [cartList]);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        <RedDot>{cartListNum}</RedDot>
        <ShoppingCart />
      </Button>

      <Modal show={show} onHide={handleClose} style={{ color: "#000" }}>
        <Modal.Header closeButton>
          <Modal.Title>
            Your NFT Shopping Cart{" "}
            <Button onClick={handleClearAll}>clear all</Button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cartList.map((cartItem, index) => {
            return (
              <Preview>
                # {index + 1}
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
            <SwapButton variant="primary" onClick={handleClose}>
              Checkout
            </SwapButton>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CartModal;
