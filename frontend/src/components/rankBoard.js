import React from "react";
import styled from "styled-components";

/* Styled Component */
const Board = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  background: #7a0bc0;
  border-radius: 20px;
  padding: 10px;
`;
const Container = styled.div.attrs(() => ({ className: "container" }))`
  margin-top: 1rem;
`;

const RankBoard = () => {
  return (
    <Container>
      <Board>RankBoardasdasdadasdsaasdsa</Board>
    </Container>
  );
};

export default RankBoard;
