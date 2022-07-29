import React, { useState } from "react";
// import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { ShoppingCart } from "react-feather";
import styled from "styled-components";
import { Button } from "../button";

const CartModal = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
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
          <ul>1</ul>
          <ul>1</ul>
          <ul>1</ul>
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
