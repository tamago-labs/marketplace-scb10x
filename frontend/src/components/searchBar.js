import React, { useState } from "react";
import { Search } from "react-feather";
import { Link } from "react-router-dom";
import styled from "styled-components";

/** Styled Component */

/** Component */
const SearchBar = () => {
  const [text, setText] = useState("");

  const handleSearchChange = (e) => {
    setText(e.currentTarget.value);
  };

  return (
    <div>
      <input
        type="search"
        name="search"
        id="search"
        onChange={(e) => handleSearchChange(e)}
      />
      <Link to={`/collections/search/${text}`} style={{ color: "#ffff" }}>
        <Search />
      </Link>
    </div>
  );
};

export default SearchBar;
