import React, { useState, useEffect, useCallback, useMemo } from "react"
import styled, { keyframes } from "styled-components"
import { Container } from "reactstrap"
import { Button } from "../button"

const Description = styled.p`
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    font-size: 14px;
    padding: 1.5rem;
    padding-bottom: 0px;
    text-align: center;
`

const Launchpad = () => {
    return (
        <Container>
            <Description>
                Launchpad helps digital artists launch the NFT collection on any chain and accept any tokens for minting
            </Description>
            <div className="text-center">
                <Button>
                    Apply Launchpad
                </Button>
            </div>
        </Container>
    )
}

export default Launchpad
