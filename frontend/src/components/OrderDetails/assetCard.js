import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { resolveNetworkName } from "../../helper";
import useOrder from "../../hooks/useOrder";
import Skeleton from "react-loading-skeleton";
import { toast } from 'react-toastify';
import { Puff } from "react-loading-icons";
import { Briefcase } from "react-feather"
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import CrosschainSwapModal from "../Modal/CrosschainSwapModal";
import SwapModal from "../Modal/SwapModal"
import { PairAssetCard } from "../cards";
import { useERC721 } from "../../hooks/useERC721";
import { useERC1155 } from "../../hooks/useERC1155";
import { useERC20 } from "../../hooks/useERC20"

export const CROSSCHAIN_SWAP_PROCESS = {
  NONE: 0,
  PREPARE: 1,
  DEPOSIT: 2,
  APPROVE: 3,
  COMPLETE: 4,
};

const MAX_WAITING_TIME = 180;

const SwapButton = styled.button.attrs(() => ({
  className: "btn shadow",
}))`
  color: #7a0bc0;
  background: #ffffff; 
  font-weight: 600;
  border-radius: 32px;
  margin-top: 12px;
  width: 100%;
  cursor: pointer;
  :hover {
    color: #ffffff;
    background: #fa58b6;
  } 
`;

const L1Text = styled.div.attrs(() => ({ className: "name" }))` 
`

const L2Text = styled(L1Text)`
  display: inline;
`

const shorterName = (name) => {
  return name.length > 28 ? `${name.slice(0, 15)}...${name.slice(-4)}` : name;
};

const delay = (timer) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timer * 1000);
  });
};

const AssetCard = ({ order, item, crossChain, id, account, library, baseMetadata, increaseTick }) => {
  const { chainId } = useWeb3React();
  const { resolveMetadata, partialSwap, claim, swap, generateClaimProof, eligibleToClaim } = useOrder();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [crosschainProcess, setCrosschainProcess] = useState(
    CROSSCHAIN_SWAP_PROCESS.NONE
  );
  const [swapModalVisible, setSwapModalVisible] = useState(false)
  const [ownedItems, setOwnedItems] = useState(-1);
  const [approved, setApproval] = useState(false)
  const [tick, setTick] = useState()

  const assetAddressContractErc721 = useERC721(
    item.assetAddress,
    account,
    library
  );

  const assetAddressContractErc1155 = useERC1155(
    item.assetAddress,
    account,
    library
  );

  const contractErc20 = useERC20(
    item.assetAddress,
    account,
    library
  )

  useEffect(() => {


    if (account) {
      fetchItem();
    } else {
      setOwnedItems(undefined)
    }

  }, [account, item, tick]);

  const fetchItem = useCallback(async () => {

    console.log("start fetching...")

    setOwnedItems(undefined)
    setApproval(false)

    if (item.tokenType === 0) {

      const { getBalance, isApproved } = contractErc20
      const balance = await getBalance()

      setOwnedItems(balance);
      isApproved().then(setApproval)

    }

    else if (item.tokenType === 1) {
      const balance = await assetAddressContractErc721.getBalance();
      setOwnedItems(balance);
      assetAddressContractErc721.isApproved().then(setApproval)
    }
    else if (item.tokenType === 2) {
      const balance = await assetAddressContractErc1155.getTokenBalanceId(
        item.assetTokenIdOrAmount
      );
      setOwnedItems(balance.toString());
      assetAddressContractErc1155.isApproved().then(setApproval)
    }
  }, [assetAddressContractErc721, assetAddressContractErc1155, contractErc20])

  useEffect(() => {
    return () => {
      setCrosschainProcess(CROSSCHAIN_SWAP_PROCESS.NONE);
    };
  }, []);

  useEffect(() => {
    if (item && item.tokenType !== 0) {
      setTimeout(() => {
        resolveMetadata({
          assetAddress: item.assetAddress,
          tokenId: item.assetTokenIdOrAmount,
          chainId: item.chainId,
        }).then(setData);
      }, (id + 1) * 1000);
    }

    return () => {
      setData();
    };
  }, [item, id]);

  const onSwap = useCallback(
    async () => {
      setLoading(true);

      try {

        const { index } = item

        console.log("index : ", index)

        const tx = await swap(order, index);
        await tx.wait();

        setSwapModalVisible(false)
        toast.success("Your swap is completed!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          progress: undefined,
        });

      } catch (e) {
        console.log(e, e.error);

        const message = e.error && e.error.data && e.error.data.message ? e.error.data.message : e.message

        toast.error(`${message}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          progress: undefined,
        });

      }

      setLoading(false);
      increaseTick()
    },
    [order, swap, item]
  );

  const onWaiting = useCallback(async () => {
    let timer = 0;

    while (MAX_WAITING_TIME > timer) {

      const proof = await generateClaimProof(order)
      const approved = await eligibleToClaim(order, proof)

      if (approved) {
        break
      }

      timer += 1;
      await delay(1);
    }

    setCrosschainProcess(CROSSCHAIN_SWAP_PROCESS.APPROVE);
  }, [generateClaimProof, eligibleToClaim, order]);

  const onPartialSwap = useCallback(async () => {
    setLoading(true);

    try {
      await partialSwap(order, item);

      setCrosschainProcess(CROSSCHAIN_SWAP_PROCESS.DEPOSIT);

      onWaiting();
    } catch (e) {
      console.log(e, e.error);

      const message = e.error && e.error.data && e.error.data.message ? e.error.data.message : e.message

      toast.error(`${message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        progress: undefined,
      });
    }

    setLoading(false);
  }, [order, item, partialSwap]);

  const onClaim = useCallback(async () => {
    setLoading(true);

    try {
      await claim(order, item);

      toast.success("Your swap is completed!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        progress: undefined,
      });

      setCrosschainProcess(CROSSCHAIN_SWAP_PROCESS.COMPLETE);
    } catch (e) {
      const message = e.error && e.error.data && e.error.data.message ? e.error.data.message : e.message

      toast.error(`${message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        progress: undefined,
      });
    }

    setLoading(false);
    increaseTick()
  }, [order, item, claim]);

  const onApprove = useCallback(async () => {

    setLoading(true)

    try {

      if (item.tokenType === 0) {
        const { approve } = contractErc20
        await approve()
      }
      else if (item.tokenType === 1) {
        await assetAddressContractErc721.approve();
      }
      else if (item.tokenType === 2) {
        await assetAddressContractErc1155.approve(
          item.assetTokenIdOrAmount
        );
      }
    } catch (e) {
      console.log(e.message)
    }

    console.log("tick : ", tick)
    setTick(tick + 1)
    setLoading(false)

  }, [order, item, tick, assetAddressContractErc721, assetAddressContractErc1155, contractErc20])

  return (
    <>
      <CrosschainSwapModal
        toggle={() => setCrosschainProcess(CROSSCHAIN_SWAP_PROCESS.NONE)}
        visible={crosschainProcess !== CROSSCHAIN_SWAP_PROCESS.NONE}
        process={crosschainProcess}
        item={item}
        order={order}
        onPartialSwap={onPartialSwap}
        onClaim={onClaim}
        loading={loading}
        max={MAX_WAITING_TIME}
        pairMetadata={data}
        baseMetadata={baseMetadata}
        approved={approved}
        onApprove={onApprove}
      />

      <SwapModal
        visible={swapModalVisible}
        toggle={() => setSwapModalVisible(!swapModalVisible)}
        loading={loading}
        item={item}
        order={order}
        onApprove={onApprove}
        onSwap={onSwap}
        pairMetadata={data}
        baseMetadata={baseMetadata}
        approved={approved}
      />

      <PairAssetCard
        chainId={item && item.chainId}
        image={data && data.metadata.image}
        assetAddress={item && item.assetAddress}
        tokenId={item && item.assetTokenIdOrAmount}
        isERC20={item && item.tokenType === 0}
      >
        {item.tokenType !== 0 && (
          <>
            <L1Text>
              {data ? (
                `${shorterName(data.metadata.name)} #${shorterName(
                  item.assetTokenIdOrAmount
                )} `
              ) : (
                <Skeleton height="16px" />
              )}
            </L1Text>
            <L2Text>
              {(ownedItems !== undefined && item.chainId === chainId) ? <><Briefcase />{` ${ownedItems}`}</> : <Skeleton height="16px" />}
            </L2Text>
          </>
        )}

        {item.tokenType === 0 && (
          <>
            <L1Text>
              {" "}
              {ethers.utils.formatUnits(
                item.assetTokenIdOrAmount,
                item.decimals
              )}
              {` `}
              {item.symbol}
            </L1Text>
            <L2Text>
              {(ownedItems !== undefined && item.chainId === chainId) ? <><Briefcase />{` ${ownedItems} ${item.symbol}`}</> : <Skeleton height="16px" />}
            </L2Text>
          </>
        )}

        {(!crossChain) && (
          <SwapButton
            onClick={() => item.chainId === chainId && setSwapModalVisible(true)}
            disabled={loading || !account}
          >
            {loading && (
              <Puff height="24px" style={{ marginRight: "5px" }} stroke="#7a0bc0" width="24px" />
            )}
            Swap
          </SwapButton>
        )}
        {(crossChain) && (
          <>
            <SwapButton
              disabled={loading || !account || item.chainId !== chainId}
              onClick={() =>
                setCrosschainProcess(CROSSCHAIN_SWAP_PROCESS.PREPARE)
              }
            >
              {loading && (
                <Puff height="24px" style={{ marginRight: "5px" }} stroke="#7a0bc0" width="24px" />
              )}
              Swap
            </SwapButton>
          </>
        )}

        {item.chainId !== chainId ? (
          <div>
            <p
              style={{
                fontSize: "12px",
                color: "red",
                textAlign: "center",
                marginTop: "10px",
              }}
            >
              Incorrect chain
            </p>
          </div>
        ) : (
          <>
          </>

        )}
      </PairAssetCard>
    </>
  );
};

export default AssetCard;
