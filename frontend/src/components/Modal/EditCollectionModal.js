import React, { useState, useEffect, useCallback, useContext } from "react"
import { useParams } from "react-router-dom"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap"
import { useWeb3React } from "@web3-react/core"
import styled from "styled-components"
import { X } from "react-feather"
import { TailSpin } from "react-loader-spinner"
import axios from "axios"
import { API_BASE } from "../../constants"

const CloseIcon = styled(X)`
  cursor: pointer;
  position: absolute;
  right: 10px;
`

const Header = styled(ModalHeader)`
  color: #000;
  position: relative;

  button {
    display: none;
  }
`

const InputText = styled.input.attrs(() => ({
  type: "text",
}))`
  background: transparent;
  border: 1px solid #000;
  padding: 8px;
  border-radius: 12px;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.7);
  width: 100%;
  margin: 12px 0;

  ::placeholder {
    color: #cfcfc4;
  }
`

const InputTextArea = styled.textarea.attrs(() => ({
  type: "text",
  rows: 5,
}))`
  background: transparent;
  border: 1px solid #000;
  padding: 8px;
  border-radius: 12px;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.7);
  width: 100%;
  margin: 12px 0;

  ::placeholder {
    color: #cfcfc4;
  }
`

function EditCollectionModal({ toggleModal, modalVisible, data }) {
  const { account, chainId, library } = useWeb3React()
  const [name, setName] = useState(data && data.metadata.name)
  const { address } = useParams()
  const [description, setDescription] = useState(
    data && data.metadata.description
  )
  const [loading, setLoading] = useState(false)

  const onSubmit = useCallback(async () => {
    try {
      setLoading(true)
      await axios.post(`${API_BASE}/collections/update`, {
        address,
        chainId: data.chainId,
        collectionName: name,
        description,
      })
    } catch (err) {
      console.log(err)
    } finally {
      toggleModal()
      setLoading(false)
    }
  }, [name, description, data])

  return (
    <Modal
      fullscreen="lg"
      style={{ top: "10%" }}
      isOpen={modalVisible}
      toggle={toggleModal}
    >
      <Header toggle={toggleModal}>
        Edit Collection
        <CloseIcon onClick={toggleModal} />
      </Header>
      <ModalBody style={{ color: "#000" }}>
        <h5>Name</h5>
        <InputText
          placeholder={data && data.metadata.name}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <h5>Description</h5>
        <InputTextArea
          placeholder={data && data.metadata.description}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggleModal}>
          Close
        </Button>
        <Button style={{ background: "#fa58b6", width: 120 }} onClick={onSubmit}>
          {loading && (
            <span style={{ marginRight: "10px" }}>
              <TailSpin color="#fff" height={24} width={24} />
            </span>
          )}
          Submit
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default EditCollectionModal
