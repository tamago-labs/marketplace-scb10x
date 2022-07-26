import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";
import Blockies from "react-blockies";
import { shortAddress } from "../../helper"
import Orders from "./orders"
import { Tabs, Tab } from "react-bootstrap";

const Wrapper = styled.div.attrs(() => ({ className: "container" }))`
  padding-top: 1rem;
`;

const Avatar = styled.div.attrs(() => ({
    className: "",
}))`
    margin-left: auto;
    margin-right: auto;
  `;


const Address = styled.div`
  margin-left: auto;
  margin-right: auto;
  font-size: 20px;
  margin-top: 0.5rem;
`;


const AvatarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem 1rem;
  border: 1px solid white;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  text-shadow: 1px 1px #333;

  position: relative;
  overflow: hidden;
  min-height: 225px;
  margin-bottom: 2rem;

  @media only screen and (max-width: 600px) {
    padding: 1rem 2rem;
  }
`;


const AccountTab = styled(Tabs)`
  .nav-link {
    color: #fff;
  }
`;


const Account = () => {

    const { account, chainId, deactivate } = useWeb3React();

    return (
        <Wrapper>

            {account && (
                <>
                    {/* <AvatarWrapper>
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
                                deactivate();
                                window.location.reload();
                            }}
                            style={{
                                width: "200px",
                                marginLeft: "auto",
                                marginRight: "auto",
                                marginTop: "0.5rem",
                                marginBottom: "1rem"
                            }}
                            className="btn btn-primary rounded-pill btn btn-sm"
                        >
                            Disconnect
                        </button>
                    </AvatarWrapper> */}
                    <div
                        style={{
                            maxWidth: "900px",
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}
                    >
                        <AccountTab defaultActiveKey="orders" className="mt-3 mb-3">
                            <Tab eventKey="orders" title="Your Orders">
                                <Orders />
                            </Tab>
                        </AccountTab>
                    </div>
                </>
            )}

        </Wrapper>
    )
}

export default Account