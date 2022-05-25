import styled from "styled-components"

export const Button = styled.button.attrs(() => ({ className: "btn btn-light shadow" }))`
    z-index: 10;
    color: white;
    border-radius: 32px;
    padding: 12px 24px;
    color: #262626;
`


export const ButtonPrimary = styled.button.attrs(() => ({ className: "btn btn-primary" }))`
    z-index: 10;
    color: white;
    border-radius: 32px;
    padding: 12px 48px; 
`