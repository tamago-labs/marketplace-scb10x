import React, { useState, useContext, useEffect, useCallback } from "react";
import Modal from "react-bootstrap/Modal";
import { ShoppingCart, ArrowRight } from "react-feather";
import styled from "styled-components";
import { Button } from "../button";

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

const CartModal = () => {
  const [show, setShow] = useState(false);
  const [cartList, setCartList] = useState([]);

  const handleClose = () => setShow(false);

  const handleShow = useCallback(() => {
    setShow(true);
    try {
      const cartSet = new Set();
      if (localStorage.length > 0) {
        for (let i = 0; i < localStorage.length; i++) {
          let key = localStorage.key(i);
          if (key.includes("cart")) {
            let item = JSON.parse(localStorage.getItem(key));
            cartSet.add(item);
          }
        }
        const array = Array.from(cartSet);
        setCartList(array);
        console.log(
          "🚀 ~ file: cartModal.js ~ line 58 ~ handleShow ~ cartSet",
          cartSet
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  }, [localStorage]);

  const handleClearAll = () => {
    localStorage.clear();
    setCartList([]);
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        <ShoppingCart />
      </Button>

      <Modal show={show} onHide={handleClose} style={{ color: "#000" }}>
        <Modal.Header closeButton>
          <Modal.Title>
            Your NFT Shopping Cart{" "}
            <button onClick={handleClearAll}>clear all</button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cartList.map((cartItem, index) => {
            return (
              <Preview>
                # {index}
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
                    <img
                      src={"../images/coin.png"}
                      width="100%"
                      height="120px"
                      style={{ margin: "auto" }}
                    />
                  )}
                </div>
              </Preview>
            );
          })}
        </Modal.Body>
        <Modal.Footer>
          <SwapButton variant="primary" onClick={handleClose}>
            Checkout
          </SwapButton>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CartModal;
