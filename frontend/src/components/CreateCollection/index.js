import React, { useState, useRef, useCallback } from "react"
import styled from "styled-components"
import { useWeb3React } from "@web3-react/core"
import { TailSpin } from "react-loader-spinner"
import { ethers } from "ethers"
import { X } from "react-feather"
import { toast } from "react-toastify"
import ERC721Tamago from "../../abi/ERC721Tamago.json"
import {
  shortAddress,
  resolveNetworkName,
  resolveNetworkIconUrl,
} from "../../helper"

const WalletContainer = styled.div`
  background: transparent;
  border: 1px solid #fff;
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  width: 500px;
  height: 80px;
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`

const ImageRound = styled.div`
  height: 40px;
  width: 40px;
  margin-right: 12px;
  border-radius: 50%;
  overflow: hidden;
  transform: translateX(-20%);
`

const UploadContainer = styled.div`
  background: transparent;
  border: 2px dashed #fff;
  border-radius: 16px;
  padding: 24px;
  width: 500px;
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .upload-btn {
    margin-top: 12px;
    background: #fff;
    padding: 12px 16px;
    border-radius: 16px;
    color: #000;
    cursor: pointer;

    &:hover {
      opacity: 0.64;
    }
  }
`

const InputText = styled.input.attrs(() => ({
  type: "text",
}))`
  background: transparent;
  border: 1px solid #fff;
  padding: 12px;
  border-radius: 32px;
  font-size: 16px;
  color: #fff;
  width: 500px;
  margin: 8px 0;

  ::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
`

const ImageUploadContainer = styled.div`
  width: 340px;
  height: 340px;
  position: relative;

  .close-btn {
    border: 1px solid #fff;
    border-radius: 16px;
    padding: 8px;
    cursor: pointer;
    position: absolute;
    right: -48px;

    &:hover {
      opacity: 0.64;
    }
  }
`

const PreviewContainer = styled.div`
  width: 260px;
  min-height: 380px;
  border-radius: 20px;
  padding: 12px;
  border: 1px solid #fff;
  position: relative;

  img {
    top: 0px;
    left: 0px;
    width: 100%;
    height: 220px;
    border-radius: 20px;
  }
`

const CreateCollection = () => {
  const { chainId, account, library } = useWeb3React()
  const hiddenFileInput = useRef(null)
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState()
  const [name, setName] = useState()
  const [symbol, setSymbol] = useState()
  const [description, setDescription] = useState()

  const onUploadImage = (e) => {
    setImage(e.target.files[0])
  }

  const onClickUploadImage = () => {
    hiddenFileInput.current.click()
  }

  const onCreate = useCallback(async () => {
    setLoading(true)
    try {
      await window.ethereum.enable()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const erc721TamagoFactory = new ethers.ContractFactory(
        ERC721Tamago.abi,
        ERC721Tamago.bytecode,
        signer
      )
      const erc721Contract = await erc721TamagoFactory.deploy(name, symbol)
      await erc721Contract.deployed()
      toast.success("Create collection completed!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        progress: undefined,
      })
    } catch (e) {
      console.log(e)
      toast.error(`Can not create collection`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        progress: undefined,
      })
    } finally {
      setLoading(false)
      setName("")
      setSymbol("")
      setDescription("")
      setImage()
    }
  }, [image, name, symbol, description, chainId, account, library])

  return (
    <div style={{ marginTop: 32 }} className="container d-flex">
      <div>
        <h1>
          <b>Create Collection</b>
        </h1>
        <h5 className="mt-4">ERC-721 On {resolveNetworkName(chainId)}</h5>
        <h6 className="mt-5">
          <b>Choose wallet</b>
        </h6>
        <WalletContainer>
          <ImageRound>
            <img
              style={{ height: "100%" }}
              src={resolveNetworkIconUrl(chainId)}
            />
          </ImageRound>
          <div>
            <b>{account ? shortAddress(account, 12) : ""}</b>
            <br />
            {resolveNetworkName(chainId)}
          </div>
        </WalletContainer>
        <h6 className="mt-4">
          <b>Upload file</b>
        </h6>
        <UploadContainer>
          <input
            type="file"
            ref={hiddenFileInput}
            onChange={onUploadImage}
            style={{ display: "none" }}
          />
          {image ? (
            <ImageUploadContainer>
              <div onClick={() => setImage()} className="close-btn">
                <X />
              </div>
              <img
                style={{ height: "100%", width: "100%" }}
                src={URL.createObjectURL(image)}
              />
            </ImageUploadContainer>
          ) : (
            <>
              PNG, GIF, WEBP, MP4 or MP3. Max 100mb.
              <div className="upload-btn" onClick={onClickUploadImage}>
                Upload file
              </div>
            </>
          )}
        </UploadContainer>
        <h6 className="mt-4">
          <b>Name</b>
          <small className="mx-2">(required)</small>
        </h6>
        <InputText
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter collection name"
        />
        <h6 className="mt-4">
          <b>Symbol</b>
          <small className="mx-2">(required)</small>
        </h6>
        <InputText
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="Enter token symbol"
        />
        <h6 className="mt-4">
          <b>Description</b>
          <small className="mx-2">(optional)</small>
        </h6>
        <InputText
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
        />
        <div className="mt-4 d-flex">
          <a
            onClick={onCreate}
            style={{
              zIndex: 10,
              color: "white",
              borderRadius: "32px",
              padding: "12px 24px",
              marginRight: "8px",
            }}
            className="btn btn-primary shadow"
          >
            <div style={{ display: "flex", flexDirection: "row" }}>
              {loading && (
                <span style={{ marginRight: "10px" }}>
                  <TailSpin color="#fff" height={24} width={24} />
                </span>
              )}
              Create
            </div>
          </a>
        </div>
      </div>
      <div style={{ marginTop: "140px", marginLeft: "64px" }}>
        <h6>
          <b>Preview</b>
        </h6>
        <PreviewContainer>
          {image && <img src={URL.createObjectURL(image)} />}
          <h5 className="mt-2">
            <b>{name || "Name"}</b>
          </h5>
          <h6>{description || "Description"}</h6>
          {account ? shortAddress(account, 12) : ""}
        </PreviewContainer>
      </div>
    </div>
  )
}

export default CreateCollection
