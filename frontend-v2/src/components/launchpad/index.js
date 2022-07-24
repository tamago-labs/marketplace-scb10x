import React, { useState, useEffect, useCallback, useMemo } from "react"
import styled, { keyframes } from "styled-components"
import { Container, Row, Col } from "reactstrap"
import { Button } from "../button"
import { Link } from "react-router-dom"
import Skeleton from "react-loading-skeleton";
import { shorterText } from "../../helper"
import { Rings, Audio } from 'react-loading-icons'
import PROJECTS from "../../data/projects"

const Description = styled.p`
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    font-size: 14px;
    padding: 1.5rem;
    padding-bottom: 0px;
    text-align: center;
`

const StyledContainer = styled(Container)`
    padding-top: 1rem;
`

const Header = styled.div`
    text-align: center;
`

const Body = styled.div.attrs(() => ({ className: "container" }))`

`

const LiveSection = styled.div`
    margin-top: 2rem; 
`

const PreviousSection = styled.div`
    margin-top: 2rem;
`

const Cards = styled(Row)` 
    padding-top: 10px;
`

const Card = styled.div`
    background: white; 
    height: 325px;
    margin-top: 15px;
    overflow: hidden;
    border-radius: 6px;
    color: black;
    line-height: 18px;
    display: flex;
    flex-direction: column;
    box-shadow: 5px 7px black;
    position: relative;
    cursor: pointer;

`

const CardCover = styled.div`
    position: absolute;
    height: 120px;
    top: 0px;
    left: 0px;
    width: 100%;
    background: #CBC3E3;
`

const Image = styled.img`
    width: 100%;
    height: 120px;
    object-fit: cover;
`

const CardBody = styled.div`
    position: absolute;
    height: 280px;
    top: 120px;
    left: 0px;
    width: 100%;
    padding: 10px;
    p {
        font-size: 14px;
    }
`

const Info = styled(({ className, name, value }) => {
    return (
        <div className={className}>
            <div>{name || <Skeleton />}</div>
            <p>{value || <Skeleton />}</p>
        </div>
    )
})`
    display: inline-block;
    text-align: left;
    height: 50px;
    min-width: 80px;
    margin-top: auto;
    margin-bottom: auto; 
    flex-grow: 1;
    font-size: 12px;

    div {
      padding: 0px;
      margin: 0px;
      font-weight: 600; 
    }
    a {
      color: inherit;
      text-decoration: none;
    }
    margin-right: 10px;
  `


const Project = ({ item }) => {
    return (
        <Col className="col-4">
            <Link to={`/launchpad/${item.slug}`}>
                <Card>
                    <CardCover>
                        <Image src={item.cover} />
                    </CardCover>
                    <CardBody>
                        <h5>{item.title}</h5>
                        <p>{shorterText(item.description)}</p>
                         
                        <Info
                            name="Chain"
                            value={"BNB"}
                        />
                        <Info
                            name="Total"
                            value={"10000"}
                        />
                         
                        <Info
                            name="Mint Price"
                            value={"1 BUSD,USDC,USDT"}
                        />
                    </CardBody>
                </Card>
            </Link>

        </Col>
    )
}

const Launchpad = () => {
    return (
        <StyledContainer>
            <Header>
                <Button>
                    Apply Launchpad
                </Button>
            </Header>

            <Body>
                <LiveSection>
                    <h5>
                        <Rings height="24px" stroke="white" width="24px" />{` `}
                        Live
                    </h5>
                    <Cards>
                        {PROJECTS.filter(item => !item.ended).map((item, index) => {
                            return (
                                <Project item={item} />
                            )
                        })

                        }

                    </Cards>
                </LiveSection>
                <PreviousSection>
                    <h5 style={{ paddingLeft: "36px" }}>
                        Ended
                    </h5>
                    <Cards>
                        {PROJECTS.filter(item => item.ended).map((item, index) => {
                            return (
                                <Project item={item} />
                            )
                        })
                        }
                    </Cards>
                </PreviousSection>
            </Body>

        </StyledContainer>
    )
}

export default Launchpad
