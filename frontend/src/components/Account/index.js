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
  padding-top: 1rem;
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
  font-size: 20px; 
  margin-top: 0.5rem;
 
`

const AccountTab = styled(Tabs)`
	.nav-link {
		color: #fff;
	}
`

const AvatarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem 1rem;
  background: rgb(63,94,251);
  background: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
  border-radius: 12px;
`


const AccountDetails = () => {
  const { account, chainId, deactivate } = useWeb3React()

  return (
    <Wrapper>
      <div style={{ display: "flex" }}>
        <div style={{ width: "800px", marginLeft: "auto", marginRight: "auto" }}>
          {!account && (
            <ConnectPanel />
          )}

          {account && (
            <>
              <AvatarWrapper>
                <Avatar>
                  <Blockies
                    className="rounded-pill"
                    seed={`${account}-${chainId}`}
                    scale={10}
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
                    marginTop: "0.5rem",
                    marginBottom: "1rem",
                  }}
                  className="btn btn-secondary rounded-pill btn"
                >
                  Disconnect
                </button>
              </AvatarWrapper>

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
            </>
          )}
        </div>
      </div>
    </Wrapper>
  )
}

export default AccountDetails
