import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";
import Blockies from "react-blockies";
import { Tabs, Tab } from "react-bootstrap";
import ParticleBackground from "react-particle-backgrounds";
import { shortAddress } from "../../helper";
import General from "./general";
import DisputeForm from "./disputeForm";
import Orders from "./orders";
import ConnectPanel from "./connect";
import useOrder from "../../hooks/useOrder";
import useActivities from "../../hooks/useActivities";
import History from "./history";

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

const AccountTab = styled(Tabs)`
  .nav-link {
    color: #fff;
  }
`;

const AvatarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem 1rem;
  background: rgb(63, 94, 251);
  background: radial-gradient(
    circle,
    rgba(63, 94, 251, 1) 0%,
    rgba(252, 70, 107, 1) 100%
  );
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

const AccountDetails = () => {
  const { account, chainId, deactivate } = useWeb3React();
  const { getAccountOrders } = useOrder();
  const { getActivitiesByAccount } = useActivities(chainId);

  const [orders, setOrders] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getAccountOrders().then((orders) => {
      setOrders(orders);
    });
  }, [account]);

  useEffect(() => {
    account && getActivitiesByAccount(account).then(setHistory);
  }, [account]);

  const settings = {
    particle: {
      particleCount: 35,
      color: "#fff",
      minSize: 1,
      maxSize: 4,
    },
    velocity: {
      minSpeed: 0.2,
      maxSpeed: 0.4,
    },
    opacity: {
      minOpacity: 0,
      maxOpacity: 0.6,
      opacityTransitionTime: 10000,
    },
  };

  return (
    <Wrapper>
      <div>
        <div>
          {!account && <ConnectPanel />}

          {account && (
            <>
              <AvatarWrapper>
                <ParticleBackground
                  style={{ position: "absolute", zIndex: 1 }}
                  settings={settings}
                />
                <div
                  style={{
                    position: "absolute",
                    zIndex: "10",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
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
                      marginBottom: "1rem",
                    }}
                    className="btn btn-secondary rounded-pill btn btn-sm"
                  >
                    Disconnect
                  </button>
                </div>
              </AvatarWrapper>

              <div
                style={{
                  maxWidth: "900px",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                <AccountTab defaultActiveKey="general" className="mt-3 mb-3">
                  <Tab eventKey="general" title="Profile">
                    <General />
                  </Tab>
                  <Tab eventKey="orders" title="Your Orders">
                    <Orders orders={orders} />
                  </Tab>
                  <Tab eventKey="history" title="Trade History">
                    <History history={history} />
                  </Tab>
                  <Tab eventKey="disputeForm" title="Dispute Form">
                    <DisputeForm />
                  </Tab>
                </AccountTab>
              </div>
            </>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default AccountDetails;
