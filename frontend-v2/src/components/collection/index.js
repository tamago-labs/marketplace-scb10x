import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Skeleton from "react-loading-skeleton";

const Collection = () => {

    const { address, chain } = useParams()

    return (
        <div>
            Collection {address} {chain}
        </div>
    )
}

export default Collection