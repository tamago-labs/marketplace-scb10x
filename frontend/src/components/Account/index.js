import React from "react"
import styled from "styled-components"
import { useWeb3React } from "@web3-react/core"
import Blockies from "react-blockies"
import { Tabs, Tab } from "react-bootstrap"
import { shortAddress } from "../../helper"
import General from "./general"
import Orders from "./orders"
import ConnectPanel from "./connect"

const Wrapper = styled.div.attrs(() => ({ className: "container" }))`
  padding-top: 2rem;
`

const Avatar = styled.div.attrs(() => ({
  className: "",
}))`
  margin-left: auto;
  margin-right: auto;
`

const Address = styled.div`
  margin-left: auto;
  margin-right: auto;
  font-size: 24px;
  margin-top: 1rem;

  @media only screen and (max-width: 600px) {
    font-size: 20px;
  }
`

const AccountTab = styled(Tabs)`
	.nav-link {
		color: #fff;
	}
`



const AccountDetails = () => {
  const { account, chainId, deactivate } = useWeb3React()

  return (
    <Wrapper>
      <div className="row">
        <div className="col-sm-8">
          {!account && (
            <ConnectPanel />
          )}

          {account && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Avatar>
                <Blockies
                  className="rounded-pill"
                  seed={`${account}-${chainId}`}
                  scale={12}
                />
              </Avatar>
              <Address>{shortAddress(account, 10, -6)}</Address>
              <button
                onClick={() => {
                  deactivate()
                  window.location.reload()
                }}
                style={{
                  width: "200px",
                  marginLeft: "auto",
                  marginRight: "auto",
                  marginTop: "1rem",
                  marginBottom: "1rem",
                }}
                className="btn btn-secondary rounded-pill btn"
              >
                Disconnect
              </button>
              <AccountTab defaultActiveKey="orders" className="mt-3 mb-3">
                {/* <Tab
                  eventKey="general"
                  title="General"
                >
                  <General />
                </Tab> */}
                <Tab
                  eventKey="orders"
                  title="Your Orders"
                >
                  <Orders />
                </Tab>
              </AccountTab>
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  )
}

export default AccountDetails
