import styled from "styled-components"; 
import { Container } from "reactstrap";
import Orders from "./orders"

const StyledContainer = styled.div`
    padding-bottom: 3rem;
`

const Home = () => {
    return (
        <StyledContainer>
                <Orders/>
                
        </StyledContainer>
    )
}

export default Home
