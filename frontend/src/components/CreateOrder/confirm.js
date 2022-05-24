import React from "react"
import styled from "styled-components"
import { ArrowRight } from "react-feather"

const Content = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: center;
`

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 12px;

  .title {
    font-size: 32px;
  }
`

const Card = styled.div`
  background-color: rgba(38, 38, 38, 0.6);
  width: 260px;
  height: 344px;
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  margin: 12px;
  opacity: ${(props) => (props.selected ? "0.64" : "100")};
  border: ${(props) =>
    props.selected ? "1px solid pink" : "1px solid transparent"};

  .name {
    color: #fff;
    margin-top: 12px;
  }
`
const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
`

const Confirm = ({ fromData, toData, step, setStep }) => {
  return (
    <>
      <Content>
        <CardContainer>
          <div className="title">From</div>
          <Card>
            <img src={fromData.metadata.image} width="100%" height="220" />
            <div className="name">{fromData.name}</div>
            <div className="name">Token ID: {fromData.token_id}</div>
          </Card>
        </CardContainer>
        <CardContainer>
          <ArrowRight size="100px" />
        </CardContainer>
        <CardContainer>
          <div className="title">To</div>
          <Card>
            <img src={toData.metadata.image} width="100%" height="220" />
            <div className="name">{toData.metadata.name}</div>
            <div className="name">Token ID: {toData.token_id}</div>
          </Card>
        </CardContainer>
      </Content>
      <ButtonContainer>
        {step > 1 && (
          <a
            style={{
              zIndex: 10,
              color: "white",
              borderRadius: "32px",
              padding: "12px 24px",
            }}
            className="btn btn-secondary shadow mx-4"
            onClick={() => setStep(step - 1)}
          >
            Back
          </a>
        )}
        {fromData && toData && (
          <a
            style={{
              zIndex: 10,
              color: "white",
              backgroundImage:
                "linear-gradient(to right, #f55f8d 0, #f8ae56 51%, #f55f8d 100%)",
              borderRadius: "32px",
              padding: "12px 24px",
            }}
            className="btn shadow"
            onClick={() => setStep(step + 1)}
          >
            Confirm
          </a>
        )}
      </ButtonContainer>
    </>
  )
}

export default Confirm
