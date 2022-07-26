const { db } = require("../../../firebase")
const { NFTStorage } = require('nft.storage')
//Blob is included in node version 15 or higher (Node version 16 recommended)
const { Blob } = require("buffer");
const { default: axios } = require("axios");

//The function below resets DB migration to IPFS, it deletes all data from "orders-v2" collection, Do not Invoke 
exports.resetMigration = async () => {

  try {

    console.log("resetting migration status and clearing CID for new migration")

    //resetting migration status and clearing CID for new migration

    const a = (await db.collection("orders").get()).docs.map(doc => { doc.ref.update({ isMigrated: false, "CID-v2": "" }) })

    //quell orders V2  
    const b = (await db.collection("orders-v2").get()).docs.map(doc => { doc.ref.delete() })

  } catch (error) {
    console.log(error)
  }

}


//The Migration Program starts here

exports.migrateOrdersToIPFS = async () => {
  try {

    const orders = (await db.collection("orders").where("isMigrated", "==", false).get()).docs.map(doc => ({ ...doc.data(), docId: doc.id }))

    //TODO switch to NFT.storage
    const nftStorage = new NFTStorage({ token: process.env.NFT_STORAGE_API_KEY })

    for (let order of orders) {
      const newData = {
        category: order.category,
        timestamp: order.timestamp,
        chainId: order.chainId,
        ownerAddress: order.ownerAddress,
        baseAssetAddress: order.baseAssetAddress,
        baseAssetTokenIdOrAmount: order.baseAssetTokenId,
        baseAssetTokenType: order.baseAssetIs1155 ? 2 : 1,
        barterList: order.barterList,
        title: order.title,
      }

      //In case of IPFS, file name has no effect
      const blob = new Blob([JSON.stringify(newData)])
      const CID = await nftStorage.storeBlob(blob)


      await db.collection("orders-v2").doc(CID).set({
        visible: order.visible,
        locked: order.locked,
        slug: order.slug,
        canceled: order.canceled,
        confirmed: order.confirmed,
        crosschain: order.crosschain,
      })

      await db.collection("orders").doc(order.docId).update({ "isMigrated": true, "CID-v2": CID })
    }
  } catch (error) {
    console.log(error)
  }
}

exports.migrateFromCIDToDB = async () => {
  try {
    const CIDS = [
      //Eth main
      "bafkreiccbbwofeaw22t7kql6edawlr7tqerdoctgmow3twkqy2clby64ru",
      "bafkreigxbmbrioxa2gjvvebzdkz5bi2kvnxwesmr2c4vlvyrkcvopgzddu",
      "bafkreiardow3yed4ykavwqiqeb2iscuh532dwdd2usljcbnaz5bntjfao4",
      "bafkreibmofw5qxt2vsg7ssrq5n3hpdzs4ra2jq3m4zcwphh3oxjjs6u5jy",
      "bafkreig7yrpv6f4b574of7cpbzfjqejitwjwcy7jzrfk3xiubgb7emdche",
      "bafkreigzbcmmjnpgllkmho7wlqnb4ezhka23d6ojpm6v5i6qajwz747yxm",
      "bafkreidbvodnz2rcizxzaa3rx7fmpykjpvqqtxxyzeax5si55paxq26v5e",
      //Polygon main
      "bafkreiflttfrdgosch35eczen2cvqss2e2ntx5jk77rjpinljks4ohshh4",
      "bafkreidlgypycqlm2l6v3fkjjyjtcnigf65k2mzv4ja45mk4a2d2u7lbve",
      "bafkreigxepmjltzzqv7ubwvwpkv3lc5llm2wf6nv6daepa7lhhubxlbxt4",
      "bafkreib4nyrvy7hc243cj4q3r7l67pf2qpvvdgmhfi2spgxbrydgnv2iuq",
      //BNB main
      "bafkreihv47bce65zx3uzielcwoki4ffrq6wiqi26r7davnphyscxa4tf5m",
      //AVALANCHE main
      "bafkreigdgyzjkshtxu7yg5luvllbgacsw5zmikbmmrcdqzd5c4nj4fbhci",
      //kovan test
      "bafkreiddpbovyl26phtoudm5datydraj52eh6pzfbdms4m2dlec2s6zmne",
      "bafkreibyazzlap6fgrgaxmge77zqc4ct7d3raffqx663p7p6x5b7lqnd7q",
      "bafkreieppliiek5ouqx52decjdsvk73uel5hpt65ljft4sjighf56juzl4",
      "bafkreiao5cznrkez2pin3lxdr765wukbw7aam4yfzm7vfvsv4vvgceb27a",
      "bafkreia5pz425dcipsb2ihabgwidye25ouwre7viyo6tlu7nuwvuhqdw5i",
      "bafkreigcnxuklyfxk5x2y6huybmzsv5rwgesa3unj5u2i4a6prah55lul4",
      "bafkreigkgdrxhvb4va3yrh6zrn7wjafcdqlpyodgmg5l4apbkf3dism5ku",
      "bafkreigejppvtxcpabl6xjewihrfgchsz3onyhaugbgs2bq67qbswkcjuq",
      "bafkreiftykijcjat7s6pgt4uu6lukq6ffdsymxx4u756eke7erl7jnkqny",
      //mumbai test
      "bafkreieri5fzumxnnp57jxes2qrs2txwn6tc4m2jmmzrawzkljpwvwani4",
      "bafkreiayczhsojnlcm7ra6iok6wpwlxznwtfsfzhbrxftog4fxdgq4rkvq",
      "bafkreiad7y353wbg4kj737cc3lhegcnw5yuhlhhvdxro5zz7gmq2s7pqyu",
      "bafkreigceyu35ipp35eekqxk2j4f33l4ug3msmlkuo3v3njd2zl4j6j6oa",
      "bafkreiafqldrlkroold443rdeclqxlzha45bu6sxzabxk47oe6mmikvzim",
      "bafkreidw2rgntcrdh57fnmj6zksifxs6aiku7obqqx64id4lq2dprh62ta",
      "bafkreiffhzurmyecwvkew5upk3tsjvcuelu6yrlfrem4is33unxr4qt7fu",
      "bafkreig2hbufy7hei2ivaq2pnafxzjeikopil4tlfx6gg7vulrnptcvbhi",
      "bafkreihw7cj2oq5ma3yiijle4kgi5lgrqbugkiw3y2jx5zdaqliy6s254u",
      "bafkreiamck3ne54xobfa32dzikadfd7vkl6kxnqn7l3lzau4g773b2z7by",
      //bnb testnet
      "bafkreibaqrqyi4eluuwdgvts4q3djozclbbfcwudxalf6sbfraizguaa4q",
      "bafkreibkaxecq7zkmaftsqgobuptqhdpzziz63kwrderndjt32ewrwjvry",
      "bafkreigo44i5q53kguubvf3hxdpucrnkdv6p3mlj25sneo344fe2lvprpu",
      "bafkreibwmi3htupgrtame52kceagqfnjk7t4utmqqc2hwwh7uzwheyx6jq",
      "bafkreiamsyykjlkmykp52aq6tl7pkbncl7iz3ltq2tak6vkapm7tt6gcva",
      "bafkreig6xjdouaulvpcmvusolocqj5fbh7okfzbp326o3m42k57z64n37i",
      "bafkreicsossgrclzqqmlqyixz6khbxft2bsnlggv65clnahpxds7cgleym",
      "bafkreihnyqlpulkr5s2i3nsgrsdej4cx2aeaoefmcz4nidgxd6z2ze2vn4",
      "bafkreid6zdnckecdjxmpapfy7o5lqcohopw6rj5tv3oajjlr2mt3vpxwum",
      "bafkreic5pgfrk66uuasbqjfwwtyklxcxfye45n4g2lh4a36shhncij5chu",
      //fuji testnet
      "bafkreifen5lynaijzdk6kty2ggiq4ktvvorjelckkotejljww23po4yeci",
      "bafkreiby5fygarj6shigcnln4bl7vzmpierfzitmjsaezlcgp7jk6kn5hi",
      "bafkreic2c7gilr5i5br27szwh7mkon3nhjj7zoqmwlggwym45cekygv44q",
    ]
    for (let CID of CIDS) {
      const url = `https://${CID}.ipfs.infura-ipfs.io/`
      const res = await axios.get(url)
      //use CID and res.data
      const order = res.data
      await db.collection("orders-v2").doc(CID).set({
        visible: true,
        locked: false,
        slug: "",
        canceled: false,
        confirmed: false,
        crosschain: false,
      })
    }
  } catch (error) {
    console.log(error)
  }
}