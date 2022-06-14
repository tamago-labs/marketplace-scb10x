import React, { useState, useEffect, useCallback, useContext } from "react"
import { useWeb3React } from "@web3-react/core"
import styled from "styled-components"
import { ToastContainer, toast } from "react-toastify"
import { Table } from "react-bootstrap"
import { TailSpin } from "react-loader-spinner"
import "react-toastify/dist/ReactToastify.css"
import useDispute from "../../hooks/useDispute"

const Wrapper = styled.div.attrs(() => ({
  className: "rounded-md",
}))`
  background: var(--secondary);
  min-height: 200px;
  margin-top: 1rem;
  padding: 20px;

  p {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  hr {
    background: white;
    margin-top: 2rem;
    margin-bottom: 2rem;
  }

  .error-message {
    margin-left: 10px;
    font-size: 14px;
    color: var(--danger);
  }
`

const InputText = styled.input.attrs(() => ({
  type: "text",
}))`
  background: transparent;
  border: 1px solid #fff;
  padding: 12px;
  border-radius: 32px;
  font-size: 16px;
  color: #fff;
  width: 100%;
  margin: 12px 0;

  ::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
`

const InputTextArea = styled.textarea.attrs(() => ({
  type: "text",
  rows: 5,
}))`
  background: transparent;
  border: 1px solid #fff;
  padding: 12px;
  border-radius: 32px;
  font-size: 16px;
  color: #fff;
  width: 100%;
  margin: 12px 0;

  ::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
`

const DisputeTable = styled(Table)`
  color: #fff;

  tr {
    width: 100%;
  }
`

const DisputeForm = () => {
  const { account } = useWeb3React()
  const { signMessage, createDispute, getDisputesByOwner } = useDispute()
  const [disputes, setDisputes] = useState()
  const [email, setEmail] = useState()
  const [address, setAddress] = useState()
  const [orderLink, setOrderLink] = useState()
  const [crossChain, setCrosschain] = useState(false)
  const [comments, setComment] = useState()
  const [loading, setLoading] = useState()
  const [error, setError] = useState()

  useEffect(() => {
    account && getDisputesByOwner(account).then(setDisputes)
  }, [account])

  console.log(disputes)

  const onConfirm = useCallback(async () => {
    const message = "Please sign this message to confirm your form."

    const { signature } = await signMessage(message)

    setLoading(true)
    setError("")
    if (!email || !address || !orderLink || !comments) {
      setError("Please fill all row")
      return
    }
    try {
      const { disputeId } = await createDispute({
        email,
        address,
        orderLink,
        crossChain,
        comments,
        message,
        signature,
      })
      toast.success("Create dispute form completed!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        progress: undefined,
      })
      setEmail("")
      setAddress("")
      setOrderLink("")
      setComment("")
    } catch (e) {
      setError("Something go wrong")
    } finally {
      setLoading(false)
    }
  }, [email, address, orderLink, crossChain, comments])

  return (
    <Wrapper>
      <ToastContainer
        position="top-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
      />
      <h5>Email</h5>
      <InputText value={email} onChange={(e) => setEmail(e.target.value)} />
      <h5>Address</h5>
      <InputText value={address} onChange={(e) => setAddress(e.target.value)} />
      <h5>Your Order Link</h5>
      <InputText
        value={orderLink}
        onChange={(e) => setOrderLink(e.target.value)}
      />
      <h5>Type</h5>
      <div className="d-flex">
        <div onClick={() => setCrosschain(false)}>
          <input type="radio" checked={!crossChain} />
          <label style={{ marginLeft: "10px" }}>Intra-chain</label>
        </div>
        <div onClick={() => setCrosschain(true)} style={{ marginLeft: "20px" }}>
          <input type="radio" checked={crossChain} />
          <label style={{ marginLeft: "10px" }}>Cross-chain</label>
        </div>
      </div>
      <h5 className="mt-3">Comments</h5>
      <InputTextArea
        value={comments}
        onChange={(e) => setComment(e.target.value)}
      />
      <a
        onClick={onConfirm}
        style={{
          zIndex: 10,
          color: "white",
          borderRadius: "32px",
          padding: "12px 24px",
          marginRight: "8px",
        }}
        className="btn btn-primary shadow"
      >
        <div style={{ display: "flex", flexDirection: "row" }}>
          {loading && (
            <span style={{ marginRight: "10px" }}>
              <TailSpin color="#fff" height={24} width={24} />
            </span>
          )}
          Confirm
        </div>
      </a>
      {error && <span className="error-message">{error}</span>}
      <hr />
      <DisputeTable>
        <thead>
          <tr>
            <th>#</th>
            <th>Created</th>
            <th>Status</th>
            <th>Admin Comment</th>
          </tr>
        </thead>
        <tbody>
          {disputes
            ? disputes.map((data, index) => (
                <tr key={index}>
                  <td>{data.disputeId}</td>
                  <td>
                    {new Date(Number(data.timestamp) * 1000).toLocaleString()}
                  </td>
                  <td>{data.resolved ? "Resolved" : "Not Resolved"}</td>
                  <td>{data.adminComment}</td>
                </tr>
              ))
            : ""}
        </tbody>
      </DisputeTable>
    </Wrapper>
  )
}

export default DisputeForm
