import React from "react"
import styled from "styled-components"
import { resolveNetworkName } from "../../helper"

const Container = styled.div`
  background-color: rgba(38, 38, 38, 0.6);
  width: 260px;
  min-height: 380px;
  border-radius: 12px;
  padding: 12px; 
  border: 1px solid transparent;
  margin-left: 3px;
  margin-right: 3px;
  margin-bottom: 10px;

  .name {
    color: #fff;
    margin-top: 12px;
  }
`

const AssetCard = ({ item, crossChain }) => {

    return (
        <Container>
            <img src="https://via.placeholder.com/200x200" width="100%" height="220" />
            <div className="name">Clone X</div>
            <div className="name">Chain: {resolveNetworkName(item.chainId)}</div>

            {!crossChain &&
                <a
                    style={{
                        color: "white",
                        borderRadius: "32px",
                        marginTop: "12px",
                        width: "100%"
                    }}
                    className="btn btn-primary shadow"
                >
                    Swap
                </a>

            }
            {crossChain &&
                <a
                    style={{
                        color: "white",
                        borderRadius: "32px",
                        marginTop: "12px",
                        width: "100%"
                    }}
                    className="btn btn-primary shadow"
                >
                    Swap
                </a>

            }
        </Container>
    )
}

export default AssetCard
