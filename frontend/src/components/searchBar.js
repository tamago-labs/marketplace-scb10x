import React, { useState, useCallback } from "react";
import { Search } from "react-feather";
import { Link } from "react-router-dom";
import styled from "styled-components";

/** Styled Component */
const SearchInput = styled.input`
  background-color: #9c86ff;
  color: #ffff;
  border-radius: 20px;
  border: none;
  width: 60%;
  padding: 2px 10px 2px 35px;

  ::placeholder {
    color: #ffff;
    opacity: 0.6;
  }
`;

const SearchIcon = styled.a`
  position: relative;
  color: #ffff;
  width: 10px;
  padding: 3px;
  border-radius: 20px;
  left: 30px;
`;

const Wrapper = styled.div`
  @media only screen and (max-width: 600px) {
    display: none;
  }

`

/** Component */
const SearchBar = () => {
  const [text, setText] = useState("");
  const [isPressEnter, setIsPressEnter] = useState(false);

  const handleSearchChange = (e) => {
    setText(e.currentTarget.value);
  };

  const handlePressEnter = useCallback(
    (e) => {
      if (e.key === "Enter") {
        window.open(`/collections/search/${text}`, "_self");
      }
    },
    [text]
  );

  return (
    <Wrapper>
      <Link to={`/collections/search/${text}`} style={{ color: "#ffff" }}>
        <SearchIcon>
          <Search />
        </SearchIcon>
      </Link>
      <SearchInput
        type="search"
        name="search"
        id="search"
        placeholder="Search..."
        onChange={(e) => handleSearchChange(e)}
        onKeyDown={(e) => handlePressEnter(e)}
      />
    </Wrapper>
  );
};

export default SearchBar;
