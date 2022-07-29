import React, { useCallback, useState, useMemo, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import styled from "styled-components";
import { ArrowRight, Check, X } from "react-feather";
import { Puff } from "react-loading-icons";
import { ethers } from "ethers";

import { resolveNetworkName, shortAddress, shorterName } from "../../helper";
import { PROCESS } from "./";
import { Alert } from "../alert";
import useOrder from "../../hooks/useOrder";
import { Button } from "../button";
import { CommonCard } from "../card";
import { useOpenSeaOrders } from "react-moralis";

const Wrapper = styled.div`
  padding-bottom: 2rem;
`;

const CATEGORY = [
  "Art",
  "Cards",
  "Collectible",
  "Domain",
  "Music",
  "Photo",
  "Sports",
  "Metaverse",
];

const orderTemplate = {
  category: "Unknown",
  timestamp: 0,
  chainId: 42,
  ownerAddress: "",
  baseAssetAddress: "",
  baseAssetTokenIdOrAmount: 0,
  baseAssetTokenType: 0,
  barterList: [],
};

const orderTemplateToken = {
  category: "Unknown",
  timestamp: 0,
  chainId: 42,
  ownerAddress: "",
  baseAssetAddress: "",
  baseAssetTokenIdOrAmount: 0,
  baseAssetTokenType: 0,
  barterList: [],
};

const getOrderTemplate = () => {
  let order = new Object();
  const randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  order["title"] = `Order #${randomNumber}`;
  return order;
};

const getOrderTemplateToken = () => {
  let order = new Object();
  const randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  order["title"] = `Order #${randomNumber}`;
  return order;
};

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 2rem;

  button {
    :first-child {
      margin-right: 20px;
    }
  }
`;

const PreviewContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
`;

const Title = styled.div`
  font-size: 18px;
  text-align: center;
`;

const PreviewFrom = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;

  > div {
    padding-top: 20px;
    margin: auto;
  }
`;

const PreviewDivider = styled.div`
  flex: 1;
  display: flex;
`;

const PreviewTo = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;

  > div {
    padding-top: 20px;
    margin: auto;
    display: flex;
    flex-wrap: wrap;
  }
`;

const TableContainer = styled.div`
  background-color: rgba(38, 38, 38, 0.6);
  padding: 10px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 12px;

  .table {
    color: white;
  }
`;

const Confirm = ({
  fromData,
  toData,
  step,
  setStep,
  process,
  setProcess,
  setToData,
  toTokens,
  setToTokens,
  fromTokens,
}) => {
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState([]);
  const { createOrder, approveNft, approveToken, register } = useOrder();
  const { chainId, account } = useWeb3React();
  const [approveItem, setApproveItem] = useState([]);

  //values return as List[]
  const values = useMemo(() => {
    let orderList = [];
    if (fromData) {
      fromData.map((item) => {
        let orderData = getOrderTemplate();
        orderData.chainId = item.chainId;
        orderData.baseAssetAddress = item.token_address;
        orderData.baseAssetTokenIdOrAmount = item.token_id;
        orderData.baseAssetTokenType = item.contract_type === "ERC1155" ? 2 : 1;
        if (toData) {
          orderData.barterList = toData.map((item) => {
            return {
              assetAddress: item.token_address,
              assetTokenIdOrAmount: item.token_id,
              tokenType: item.contract_type === "ERC1155" ? 2 : 1,
              chainId: item.chainId,
            };
          });
        }
        if (toTokens) {
          orderData.barterList = orderData.barterList.concat(toTokens);
        }
        orderList.push(orderData);
      });
    }

    if (fromTokens) {
      fromTokens.map((item) => {
        let orderToken = getOrderTemplateToken();
        orderToken.chainId = item.chainId;
        orderToken.baseAssetAddress = item.baseAssetAddress;
        orderToken.baseAssetTokenIdOrAmount = item.baseAssetTokenIdOrAmount;
        orderToken.baseAssetTokenType = item.baseAssetTokenType;
        if (toData) {
          orderToken.barterList = toData.map((item) => {
            return {
              assetAddress: item.token_address,
              assetTokenIdOrAmount: item.token_id,
              tokenType: item.contract_type === "ERC1155" ? 2 : 1,
              chainId: item.chainId,
            };
          });
        }
        if (toTokens) {
          orderToken.barterList = orderToken.barterList.concat(toTokens);
        }
        orderList.push(orderToken);
      });
    }
    return orderList;
  }, [fromData, toData, chainId, toTokens, fromTokens]);

  //get set unique asset address to approve
  useEffect(() => {
    const approveItemSet = new Set();
    values.map((item) => {
      approveItemSet.add(item.baseAssetAddress);
    });
    setApproveItem(approveItemSet);
  }, [values]);

  const onGenerateId = useCallback(async () => {
    let orderIdList = [];
    if (values[0].barterList.length === 0) {
      return;
    }

    setLoading(true);

    try {
      for (let i = 0; i < values.length; i++) {
        const { orderId } = await createOrder(values[i]);
        orderIdList.push(orderId);
      }
      setOrderId(orderIdList);
      setProcess(PROCESS.GENERATE_ID);
    } catch (e) {
      console.log(e);
    }

    setLoading(false);
  }, [values, createOrder]);

  const onApprove = useCallback(async () => {
    setLoading(true);

    try {
      await Promise.all(
        approveItem.map(async (item) => {
          if (item.baseAssetTokenType === 0) {
            await approveToken(item);
          } else {
            await approveNft(item);
          }
        })
      );
      setProcess(PROCESS.DEPOSIT);
    } catch (e) {
      console.log(e);
    }

    setLoading(false);
  }, [values, approveNft, approveToken]);

  const onRegister = useCallback(async () => {
    setLoading(true);
    try {
      await register(orderId, values);

      setProcess(PROCESS.CONFIRM);
    } catch (e) {
      console.log(e);
    }

    setLoading(false);
  }, [values, orderId, register]);

  const proceed = useCallback(() => {
    switch (process) {
      case PROCESS.FILL:
        onGenerateId();
        break;
      case PROCESS.GENERATE_ID:
        onApprove();
        break;
      case PROCESS.DEPOSIT:
        onRegister();
        break;
      case PROCESS.CONFIRM:
        setProcess(PROCESS.CONFIRM);
        break;
      default:
        setProcess(PROCESS.FILL);
    }
  }, [process, onGenerateId, onApprove]);

  return (
    <Wrapper>
      <PreviewContainer>
        <PreviewFrom>
          <div>
            {fromTokens.map((token, index) => {
              return (
                <CommonCard
                  key={index}
                  image={"../images/coin.png"}
                  chainId={token && Number(token.chainId)}
                >
                  <div className="name">
                    {token.baseAssetTokenType !== 0 ? (
                      <>
                        {token.name}
                        {` `}#{shorterName(token.baseAssetTokenIdOrAmount)}
                      </>
                    ) : (
                      <>
                        {ethers.utils.formatUnits(
                          token.baseAssetTokenIdOrAmount,
                          token.decimals
                        )}
                        {` `}
                        {token.symbol}
                      </>
                    )}
                  </div>
                </CommonCard>
              );
            })}
            {fromData.map((nft, index) => {
              return (
                <CommonCard
                  key={index}
                  image={nft && nft.metadata.image}
                  chainId={nft && Number(nft.chainId)}
                >
                  <div className="name">
                    {nft.name}
                    {` `}#{shorterName(nft.token_id)}
                    {/* {nft.baseAssetTokenType !== 0 ? (
                      <>
                        {nft.name}
                        {` `}#{shorterName(nft.baseAssetTokenIdOrAmount)}
                      </>
                    ) : (
                      <>
                        {ethers.utils.formatUnits(
                          nft.baseAssetTokenIdOrAmount,
                          nft.decimals
                        )}
                        {` `}
                        {nft.symbol}
                      </>
                    )} */}
                  </div>
                </CommonCard>
              );
            })}
          </div>
          {/* <CommonCard
            image={fromData && fromData.image}
            chainId={fromData && Number(fromData.chainId)}
          >
            <div className="name">
              {fromData.baseAssetTokenType !== 0 ? (
                <>
                  {fromData.name}
                  {` `}#{shorterName(fromData.baseAssetTokenIdOrAmount)}
                </>
              ) : (
                <>
                  {ethers.utils.formatUnits(
                    fromData.baseAssetTokenIdOrAmount,
                    fromData.decimals
                  )}
                  {` `}
                  {fromData.symbol}
                </>
              )}
            </div>
          </CommonCard> */}
        </PreviewFrom>
        <PreviewDivider>
          <div style={{ margin: "auto" }}>
            <ArrowRight size={32} />
          </div>
        </PreviewDivider>
        <PreviewTo>
          <div>
            {toTokens.map((token, index) => {
              return (
                <CommonCard
                  key={index}
                  image={"../images/coin.png"}
                  chainId={token && Number(token.chainId)}
                >
                  <div className="name">
                    {ethers.utils.formatUnits(
                      token.assetTokenIdOrAmount,
                      token.decimals
                    )}
                    {` `}
                    {token.symbol}
                  </div>
                </CommonCard>
              );
            })}
            {toData.map((nft, index) => {
              return (
                <CommonCard
                  key={index}
                  image={nft.metadata.image}
                  chainId={nft && Number(nft.chainId)}
                >
                  <div className="name">
                    {nft.metadata.name}
                    {` `}#{shorterName(nft.token_id)}
                  </div>
                </CommonCard>
              );
            })}
          </div>
        </PreviewTo>
      </PreviewContainer>
      <TableContainer>
        <table className="table">
          <thead>
            <tr>
              <td>#</td>
              <td>Task</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>
                Upload your entry to Filecoin
                {/* (CID:
                {orderId && shortAddress(orderId, 3, -3)}) */}
              </td>
              <td>{process > 0 ? <Check /> : <X />}</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Approve the contract to spend your tokens</td>
              <td>{process > 1 ? <Check /> : <X />}</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Register the hash on the contract</td>
              <td>{process > 2 ? <Check /> : <X />}</td>
            </tr>
          </tbody>
        </table>
      </TableContainer>

      <p className="mt-3 text-center">
        To confirm the order, you must complete above steps one by one.
      </p>

      {process === PROCESS.CONFIRM && (
        <Alert>Your order has been successfully created!</Alert>
      )}

      <ButtonContainer>
        {step > 1 && (
          <Button
            onClick={() => setStep(step - 1)}
            disabled={loading || process !== PROCESS.FILL}
          >
            Back
          </Button>
        )}
        {fromData && toData && (
          <Button
            disabled={
              loading ||
              process === PROCESS.CONFIRM ||
              values[0].barterList.length === 0
            }
            onClick={proceed}
          >
            {loading && (
              <Puff height="24px" style={{ marginRight: "5px" }} width="24px" />
            )}

            {process === PROCESS.FILL && "Confirm"}
            {process === PROCESS.GENERATE_ID && "Approve"}
            {process === PROCESS.DEPOSIT && "Register"}
            {process === PROCESS.CONFIRM && "Completed"}
          </Button>
        )}
      </ButtonContainer>
    </Wrapper>
  );
};

export default Confirm;
