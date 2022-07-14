import React, { useState } from 'react'
import { Button } from "reactstrap";
import styled from "styled-components";
import AdminDisputeModal from '../Modal/AdminDisputeModal';

const StyledDisputeCard = styled.div`
  width: 100%;
  margin-top: 1rem;
  padding: 1.5rem;
  background-color: rgba(255,255,255,0.9);
  color: black;
  border-radius: 0.25rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  header{
    display: flex;
    justify-content: space-between;
  }
  p{
    margin-top: 0rem;
  }
  pre {
    background-color: rgba(0, 0, 0, 0.1);
    padding: 0.5rem;
  }
  small{
    color : rgba(0, 0, 0, 0.7)
  }
  b{
    font-weight: 500;
  }
`;

function DisputeCard({ item }) {

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [adminComment, setAdminComment] = useState(item.adminComment)
  const [resolved, setResolved] = useState(item.resolved)

  const handleModalOpen = () => {
    setIsModalOpen(prev => !prev)
  }

  return (
    <StyledDisputeCard>
      <header>
        <h6>
          <strong>Dispute ID:{item.disputeId}</strong>
        </h6>
        <p>
          status: {resolved ? <span className="text-success">resolved</span> : <span className="text-danger">not resolved</span>}
        </p>
        <p>
          type: {item.type}
        </p>
        <p>
          {new Date(item.timestamp * 1000).toLocaleDateString("en-gb", {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>

      </header>

      <p><b>User's wallet address :</b> {item.address}</p>
      <p><b>User's email : </b>{item.email}</p>
      <p><b>Order : </b>{item.orderLink}</p>
      <p>
        User's Comments :<pre>{item.comments}</pre>
      </p>
      <p>
        Admin's Comments <small>(not visible to users)</small>:<pre>{adminComment || " "}</pre>
      </p>
      <Button onClick={handleModalOpen}>Manage Dispute</Button>
      <AdminDisputeModal visible={isModalOpen} setIsModalOpen={setIsModalOpen} item={item} handleModalOpen={handleModalOpen} adminComment={adminComment} setAdminComment={setAdminComment} resolved={resolved} setResolved={setResolved} />
    </StyledDisputeCard>
  )
}

export default DisputeCard