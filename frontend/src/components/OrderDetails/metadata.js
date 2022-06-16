import Skeleton from "react-loading-skeleton"
import { Info } from "./"

const Metadata = ({
    data
}) => {

    const parseUri = (nft) => {

        if (!nft) {
            return ""
        }

        let uri = nft && nft.token_uri && nft.token_uri.replaceAll("000000000000000000000000000000000000000000000000000000000000000", "")

        if (uri.indexOf("https://") === -1) {
            uri = `https://${uri}`
        }

        if (uri.indexOf("{id}") !== -1) {
            uri = uri.replaceAll("{id}", nft.token_id)
        }
        return uri
    }

    return (
        <div>
            {!data &&
                <>
                    <Skeleton />
                    <Skeleton />
                </>
            }
            {data && (
                <>
                    {data.contract_type && <Info
                        name={"Type"}
                        value={data.contract_type}

                    />}
                    {data.amount && <Info
                        name={"Minted"}
                        value={data.amount}

                    />}
                    {data.token_id && <Info
                        name={"ID"}
                        value={data.token_id}

                    />}
                    {data.token_address && <Info
                        name={"Contract Address"}
                        value={data.token_address}

                    />}
                    {data.owner_of && <Info
                        name={"Owner Address"}
                        value={data.owner_of}

                    />}
                    {data.token_uri &&
                        <Info
                            name={"URI"}
                            value={parseUri(data)}

                        />
                    }
                    {data.metadata && data.metadata.attributes && data.metadata.attributes.map((item, index) => {

                        if (!item.trait_type || !item.value) {
                            return
                        }

                        return (
                            <Info
                                name={item.trait_type}
                                value={item.value}

                            />
                        )
                    })

                    }

                </>
            )

            }
        </div>
    )
}

export default Metadata