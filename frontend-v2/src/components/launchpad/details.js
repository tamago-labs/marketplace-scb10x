import { useCallback, useEffect, useMemo, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Briefcase, Check } from "react-feather"
import styled from "styled-components"
import Skeleton from "react-loading-skeleton"
import { Puff } from "react-loading-icons";
import { useWeb3React } from "@web3-react/core"
import { Row, Col } from "reactstrap"
import PROJECTS from "../../data/projects"
import { resolveNetworkName } from "../../helper"
import useLaunchpad from "../../hooks/useLaunchpad"
import { Options } from "../input"
import { ethers } from "ethers";
import { Button } from "../button"
import { useERC20 } from "../../hooks/useERC20"
import { AlertWarning } from "../alert"
import { PairAssetCard } from "../card"

const Container = styled.div.attrs(() => ({ className: "container" }))`
    margin-top: 2rem;
`

const Info = styled(({ className, name, value, link }) => {
    return (
        <div className={className}>
            <label>{name}</label>
            {!link ? (
                <p>{value || <Skeleton width="80px" />}</p>
            ) : (
                <Link to={`/collection/${link}`}>
                    <p>{value}</p>
                </Link>
            )}
        </div>
    )
})`
    display: inline-block;
    min-width: 100px;
    text-align: left;
    flex-grow: 1;
    label {
      padding: 0px;
      margin: 0px;
      font-weight: 600;
      color: var(--secondary);
      font-size: 14px;
    }
    a {
      color: inherit;
      text-decoration: none;
    }
    margin-right: 10px;
  `

const Image = styled.img`
    width: 100%; 
    height: 500px;
`

const ImageContainer = styled.div`
    overflow: hidden;
    border-radius: 12px;
    background: #CBC3E3;
`

const Title = styled.div`
    font-size: 24px;
    display: flex;
    flex-direction: row;
`

const Description = styled.div`
    font-size: 14px;
    line-height: 18px;
`

const InfoPanel = styled.div`
    background: white;  
    border-radius: 6px;
    color: black;
    display: flex;
    flex-direction: column;
    box-shadow: 5px 7px black;
    padding: 20px;
`

const MintPanel = styled.div`
    margin-top: 3rem;
    border: 1px solid white;
    border-radius: 8px; 
    padding: 20px;
    display: flex;
    flex-direction: row; 
`

const ReservedPanel = styled.div`
    margin-top: 1rem;
    border: 1px solid white;
    border-radius: 8px; 
    padding: 20px;
`

const PublicPanel = styled(ReservedPanel)`

`

const LaunchpadDetails = () => {

    const { account, library, chainId } = useWeb3React()
    const [loading, setLoading] = useState()

    const { slug } = useParams()
    const [selectToken, setSelectToken] = useState(0)
    const { amountMinted, mint } = useLaunchpad()

    const [approval, setApproval] = useState(false)
    const [totalMinted, setTotalMinted] = useState()
    const [balance, setBalance] = useState()
    const [tick, setTick] = useState()

    const data = PROJECTS.find(item => item.slug === slug)

    const { totalSupply, tokens, contractAddress } = data

    const t = tokens.find((item, i) => selectToken === i)

    const contractErc20 = useERC20(
        t.assetAddress,
        account,
        library
    )

    useEffect(() => {
        if (account) {
            setApproval(false)
            const { isApproved2, getBalance } = contractErc20
            isApproved2(contractAddress).then(setApproval)
            getBalance().then(setBalance)
        }
    }, [account, contractAddress, selectToken, tick]);

    useEffect(() => {
        data.contractAddress && data.chainId && amountMinted({ assetAddress: data.contractAddress, chainId: Number(data.chainId) }).then(setTotalMinted)
    }, [data, tick])

    const onMint = useCallback(async () => {

        setLoading(true)

        try {

            const { assetAddress, assetTokenIdOrAmount } = t
            await mint(contractAddress, assetAddress, assetTokenIdOrAmount, tokens)

        } catch (e) {
            console.log(e.message)
        }

        setTick(tick + 1)
        setLoading(false)

    }, [contractAddress, tick, t, tokens])

    const onApprove = useCallback(async () => {

        if (!account) {
            return
        }

        setLoading(true)

        try {

            const { approve2 } = contractErc20
            await approve2(contractAddress)

            setApproval(true)

        } catch (e) {
            console.log(e.message)
        }

        // setTick(tick + 1)
        setLoading(false)

    }, [contractAddress, tick, contractErc20, account])

    return (
        <Container>
            <Row>
                <Col sm="7">
                    <InfoPanel>
                        <Title>
                            {data.title}
                        </Title>
                        <Description>
                            {data.description}
                        </Description>
                        <div style={{ display: "flex", flexDirection: "row", marginTop: "1rem" }}>
                            <Info name={"Chain"} value={resolveNetworkName(data.chainId)} />
                            <Info name={"Minted"} value={totalMinted} />
                            <Info name={"Total"} value={data.totalSupply} />
                            <Info name={"Whitelisted"} value={data.totalWhitelisted} />
                        </div>
                    </InfoPanel>
                    {/* <MintPanel>
                        <div style={{ margin: "auto", marginLeft: "0px", fontSize: "20px" }}>
                            <Options
                                // disabled={showCollection === true}
                                getter={selectToken}
                                setter={(value) => setSelectToken(value)}
                                options={tokens.map((token, index) => {
                                    const string = `${ethers.utils.formatUnits(token.assetTokenIdOrAmount, token.decimals)} ${token.symbol}`
                                    return [index, string]
                                })}
                            />
                            {account && <span style={{ marginLeft: "10px", fontSize: "12px" }}>
                                Balance : {balance}
                            </span>}

                        </div>
                        <div style={{ margin: "auto", marginRight: "0px" }}>

                            {loading && (
                                <Puff height="24px" style={{ marginRight: "10px" }} stroke="#fff" width="24px" />
                            )}
                            {!approval ? (
                                <Button
                                    disabled={loading || !account}
                                    onClick={onApprove}
                                >
                                    Approve
                                </Button>
                            ) : (
                                <Button
                                    disabled={loading || !account}
                                    onClick={onMint}
                                >

                                    Mint
                                </Button>
                            )
                            }
                        </div>
                    </MintPanel> */}

                    {data && chainId !== data.chainId && (
                        <AlertWarning style={{ marginTop: "20px" }}>Connect to correct network to trade</AlertWarning>
                    )}

                    {/* <ReservedPanel>
                        Reserved Mint
                    </ReservedPanel> 

                    <hr />*/}

                    <PublicPanel>
                        <div>
                            Public Mint
                        </div>
                        {/* <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                marginTop: "1rem",
                            }}
                        >
                            {tokens.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <PairAssetCard
                                            image={"../images/coin.png"}
                                            balance={123}
                                        >

                                        </PairAssetCard>
                                    </div>
                                );
                            })}
                        </div> */}
                        <div style={{display : "flex", flexDirection  :"row", marginTop :"10px"}}>
                        <div style={{ margin: "auto", marginLeft: "0px", fontSize: "20px" }}>
                            <Options
                                // disabled={showCollection === true}
                                getter={selectToken}
                                setter={(value) => setSelectToken(value)}
                                options={tokens.map((token, index) => {
                                    const string = `${ethers.utils.formatUnits(token.assetTokenIdOrAmount, token.decimals)} ${token.symbol}`
                                    return [index, string]
                                })}
                            />
                            {account && <span style={{ marginLeft: "10px", fontSize: "12px" }}>
                                Balance : {balance}
                            </span>}

                        </div>
                        <div style={{ margin: "auto", marginRight: "0px" }}>

                            {loading && (
                                <Puff height="24px" style={{ marginRight: "10px" }} stroke="#fff" width="24px" />
                            )}
                            {!approval ? (
                                <Button
                                    disabled={loading || !account}
                                    onClick={onApprove}
                                >
                                    Approve
                                </Button>
                            ) : (
                                <Button
                                    disabled={loading || !account}
                                    onClick={onMint}
                                >

                                    Mint
                                </Button>
                            )
                            }
                        </div>
                        </div>

                    </PublicPanel>
                </Col>
                <Col sm="5">
                    <ImageContainer>
                        <Image
                            src={data.image}
                            alt="image"
                        />
                    </ImageContainer>
                </Col>
            </Row>
        </Container>
    )
}

export default LaunchpadDetails