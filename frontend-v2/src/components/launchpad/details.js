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


const LaunchpadDetails = () => {

    const { account, library, chainId } = useWeb3React()

    const { slug } = useParams()

    const data = PROJECTS.find(item => item.slug === slug)

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
                            <Info name={"Minted"} value={null} />
                            <Info name={"Total"} value={data.totalSupply} />
                            <Info name={"Whitelisted"} value={data.totalWhitelisted} />

                        </div>
                    </InfoPanel>
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