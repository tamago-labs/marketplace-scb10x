import { useState, useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import NFTABI from "../abi/launchpadNft.json";
// import NFTABI from "../abi/nft.json";
import { getProviders } from "../helper";

window.Buffer = window.Buffer || require("buffer").Buffer;

const useLaunchpad = () => {

    const context = useWeb3React();

    const { chainId, account, library } = context;

    const totalSupply = async ({ chainId, assetAddress }) => {
        const providers = getProviders();

        const { provider } = providers.find((item) => item.chainId === chainId);

        const contract = new ethers.Contract(
            assetAddress,
            NFTABI,
            provider
        );

        return Number(await contract.totalSupply())
    };

    const amountMinted = async ({ chainId, assetAddress }) => {
        const providers = getProviders();

        const { provider } = providers.find((item) => item.chainId === chainId);

        const contract = new ethers.Contract(
            assetAddress,
            NFTABI,
            provider
        );

        return `${(await contract.amountMinted())}`
    };

    const mint = useCallback(async (contractAddress, assetAddress, assetTokenIdOrAmount, tokens) => {

        if (!account) {
            throw new Error("Wallet not connected");
        }

        const contract = new ethers.Contract(
            contractAddress,
            NFTABI,
            library.getSigner()
        );

        const leaves = tokens
            .map((item) =>
                ethers.utils.keccak256(
                    ethers.utils.solidityPack(
                        ["address", "uint256"],
                        [item.assetAddress, item.assetTokenIdOrAmount]
                    )
                )
            );
        const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });

        const proof = tree.getHexProof(
            ethers.utils.keccak256(
                ethers.utils.solidityPack(
                    ["address", "uint256"],
                    [assetAddress, assetTokenIdOrAmount]
                )
            )
        );

        const tx = await contract.mint(
            assetAddress,
            assetTokenIdOrAmount,
            proof
        );

        await tx.wait()

    }, [account, chainId, library])

    return {
        amountMinted,
        totalSupply,
        mint
    }

}

export default useLaunchpad