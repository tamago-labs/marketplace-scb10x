import React, { useState } from "react";
// import Button from "react-bootstrap/Button";
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

const CartModal = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const arr = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        <ShoppingCart />
      </Button>

      <Modal show={show} onHide={handleClose} style={{ color: "#000" }}>
        <Modal.Header closeButton>
          <Modal.Title>Your NFT Shopping Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {arr.map((item, index) => {
            return (
              <ul>
                <Preview>
                  # {index}
                  <div>
                    <img
                      src={"../images/coin.png"}
                      width="80px"
                      height="80px"
                      style={{ margin: "auto" }}
                    />
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
                    <img
                      src={"../images/coin.png"}
                      width="80px"
                      height="80px"
                      style={{ margin: "auto" }}
                    />
                  </div>
                </Preview>
              </ul>
            );
          })}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Checkout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CartModal;
