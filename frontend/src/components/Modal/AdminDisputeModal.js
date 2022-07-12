import React, { useState, useCallback } from "react"
import { Modal, ModalHeader, ModalBody, ModalFooter, Input, Label } from "reactstrap"
import styled from "styled-components"
import { ToastContainer, toast } from "react-toastify"
import { X } from "react-feather"

import useAdmin from "../../hooks/useAdmin"
import useDispute from "../../hooks/useDispute"

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
const Body = styled(ModalBody)`
  color: #000;
  position: relative;

  button {
    display: none;
  }
`
const Flex = styled.div`
  display:flex;
  justify-content: space-between;
`

const StyledModal = styled(Modal)`

  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  .error-message {
    margin-left: 10px;
    font-size: 14px;
    color: var(--danger);
  }
`


const Button = styled.button.attrs(() => ({ className: "btn" }))`
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
`

const AdminDisputeModal = ({ item, handleModalOpen, visible, setIsModalOpen, adminComment, setAdminComment, resolved, setResolved }) => {
  const { disputeId } = item
  const { signMessage } = useAdmin()
  const { updateDispute } = useDispute()
  const [error, setError] = useState()

  const handleCommentChange = (e) => {
    setAdminComment(e.target.value)
  }
  const handleToggleResolved = (e) => {
    setResolved(e.target.checked)
  }

  const handleConfirmChanges = useCallback(async () => {
    const message = "Please sign this message to confirm your form."

    const { signature } = await signMessage(message)

    setError("")
    try {
      const { status } = await updateDispute({
        disputeId,
        resolved,
        adminComment,
        message,
        signature,
      })
      if (status === "ok") {
        toast.success("Submitted!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          progress: undefined,
        })
        setIsModalOpen(false)
      }
    } catch (e) {
      console.log("e --> ", e)
      setError("Something went wrong")
    }
  }, [adminComment, disputeId, setIsModalOpen, resolved, signMessage, updateDispute])

  return (
    <StyledModal style={{ top: '10%' }} isOpen={visible} toggle={handleModalOpen}>

      <Header toggle={handleModalOpen}>
        {`Manage Dispute ID: ${item.disputeId}`}
        <CloseIcon onClick={handleModalOpen} />
      </Header>
      <Body>
        <Flex>
          <Label> {"Resolved :  "}  <Input type="checkbox" checked={resolved} onChange={handleToggleResolved} /></Label>
        </Flex>

        <Label> Admin Comment : </Label>
        <Input type="textarea" value={adminComment} onChange={handleCommentChange} />

      </Body>
      <ModalFooter style={{ display: "flex" }}>
        <div style={{ width: "100%", textAlign: "center" }}>
          <Button onClick={handleConfirmChanges}>Confirm Changes</Button>
        </div>
        {error && <span className="error-message">{error}</span>}
      </ModalFooter>
    </StyledModal>

  )
}

export default AdminDisputeModal