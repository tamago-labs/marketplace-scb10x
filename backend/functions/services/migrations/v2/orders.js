const { db } = require("../../../firebase")
const { NFTStorage } = require('nft.storage')
//Blob is included in node version 15 or higher (Node version 16 recommended)
const { Blob } = require("buffer");
const { default: axios } = require("axios");

//The function below resets DB migration to IPFS, it deletes all data from "orders-v2" collection, Do not Invoke 
const resetMigration = async () => {

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

const migrateOrdersToIPFS = async () => {
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

const migrateFromCIDToDB = async () => {
  try {
    const CIDS = [
      //Avalanche main
      [
        "bafkreigdgyzjkshtxu7yg5luvllbgacsw5zmikbmmrcdqzd5c4nj4fbhci",
        "bafkreicyck6ygx4xyrptca7kmdm6r7dtbipjgtq2gqwhmwhtz3zsc6gs5e",
        "bafkreidt5drahar7hhbwhep7okj5xkrwm3yyhdeqss2zcclv43opdzju4y",
        "bafkreiekdmqgxguxswo6y4upw7w4ozz2fsyewi3dbcviukmvibxfn4ll7i",
        "bafkreidmqi2zh74udgxxz7ahf3diaokqls7j77avnmrakcel2wjkz62i6u",
        "bafkreigvz25jvy2kmzcgrvtg4fp4orvtnify5bz6ihkanr6wrul43zxglu",
        "bafkreicti2bhidfa7aa7ve7ndwir4ms3zgu22rlu2co6s6vb3v7fkde2vu",
        "bafkreic2v7esaemxbsecnic5g7qwszsvpuq2l6zgihbdb5cfbmxx6cvjn4",
        "bafkreiaa4kypk5ypxdoudt4p4acpqecttnmm4niajeiynewyo5ugm2uumm",
        "bafkreiaijfp5mik6xrvb3426ntandokcbrw57ych5up6a7dptcajmgwuqm",
        "bafkreifsb65hso3mo62fiowzgrmej2qdnmqnqjjf6lpw5walnlvfxsspey",
        "bafkreigwzjdhvxqgxhhnf6wxgg6oro3yuvymrrsan6gpngjm3cxi7kmw7e",
        "bafkreih4do2v4ooem4hyuvb2kaljjhu7v5fe3bcvyryim65fm55lv7bpru",
        "bafkreian63wjjngtzapskqqb4gbx2eudhj4aegmisbbrvak7wagvlv667q",
        "bafkreidgug24nqfogclvfb6dsqbodicwrnpntjyqhxllxi2xit7edjgnca",
        "bafkreiacpdixxjlxkrhxp2yn2tps2kksie2qvwqgp7n6mpy4o45jngligm",
        "bafkreiauoarw3mstksqnnsqvvi2uhridapxhaepydtpm5sref5c3s7kwm4",
        "bafkreigmq4gvusgzwtcgvfhi7qp6dt2fagiajbi63ujfemohnwuwzzzq2y",
        "bafkreihozegyy54eq7fw4bxnxiyvcn65akyi5ikcejrndnx6szwxhsikyq",
        "bafkreiett22wea65fyhf4cjwydpnet4ezqkexnltluqp3oo5mszaw3ti5a",
        "bafkreibzr7h7ksrf7r6rj3y6vufmcjcpo2k4b37vnl66yzv55pxhymqvju",
        "bafkreiczzmw4ijk73lhafytnqqady6rkm2vcelqubuexjbg76uz5vb5cdi",
        "bafkreif5siajuvfk6mr7qdwxl2sj6l3iuwlemjfpadbnjte6bxi5tqs2pu",
        "bafkreiajiugz4dt3glmhfviz34qzc23qinciwhsiz4f75hwrhumsbz3q6m",
        "bafkreibvid54j3n3gv4ipr3rs2bcwblzosyqlfh42aa5iivbv7i676zrti",
        "bafkreih2o4j2lfjos5jixw4be22yvybi7ovxsnkkmp7dwlq5fgkq7yday4",
        "bafkreifw4fyye3xmm2fknnydwjkdtrys2omowixgqj3zrydemrkjrpcexy",
        "bafkreiboath4umawafnilreizvisbdnh3h623hn2jwn7glonlkwhdf4mra",
        "bafkreigtwohdj6lu7w2ryrz24xpilndyosfyp2akoncf6y4rvypvq7hnwe",
        "bafkreiaqenyuqj63vzde7k7fiwnjyubfydcfqfzmgvfegaccl5klfcy75u",
        "bafkreiailjwxgrjewprxcwpzusm44avfhyqayl34lofsij5pjdnakta4fi",
        "bafkreibimgbb35dnlvifqizotgv6ofyz7ljnz4jc7icgutwlb6bmxcxkzy",
        "bafkreiawxyarijqikee5w4gxfge6a3qgaosobi2hfoorlggznz4chslbem",
        "bafkreiebl3qwgjmrffirzs4zactivu4nxlbpxht6g47qqae2gzorywsoka",
        "bafkreialpqz7kwyuqo5meybmuetvd5iuep4vhkz3hckfgjh3jmpv3uwfcu",
        "bafkreih6e4ijc5viicvqptpwhmz6fp2crg7b54datdhg4l34brzbpm3oxi",
        "bafkreie3gcvzzb4tcneas34kjom3it5xnt3qgexeppmyo4rhspjvz5ensm",
        "bafkreihg26ztes4qlnl7qyjbdrtk5j6quy5ezbnlo7oefetp5coaqunkxu",
        "bafkreieuxveo6ooh6kjdoksflzs3ymsg7t7vz7af362eokhe7w4lvgy3fe",
        "bafkreicqnm72fbnmqkzfeth3sswtpndpwppz7cbrcjf75j2aauv7dj47iy",
        "bafkreiaybjfucdw4d4dgehaki2mykwnwtb2jkqqdygo7bizh2adg25blc4",
        "bafkreibi24sswck5bahtxn2f652ugz3lrrpmdps776p72ce6afmual3aam",
        "bafkreid7jwugbrv2oh747gxq7jjgyjwd7lnfk3fa3q2tkcahpngfpozlye",
        "bafkreideq6bs2rxer7vnetlz6maehbuayjdso5t5q6w3xi5bfiglvmfdgi",
        "bafkreihrmhn772nwtb355qzspnlt2ydvlybj53syt4mcmf6gl6gejjnvri",
        "bafkreibqkqzacm7bdonb2j6b5jnyens42eamd2wkqfwfzjhndrg2znainq",
        "bafkreieabdoqf5w6nxhukyxg3ccoq7krtcdyzxztdfhtcryujlmo36q24e",
        "bafkreiaub2f32qyxduo46mnzq6e6o44yirsnhvggapin272kxxie3razse",
        "bafkreic7wyoejxasui3szue3qopyfjsn7h546jnqzd4epbtrr6yyi45iqy",
        "bafkreibnwp4pvnkbynsj44tf5ajod35whi56pl2q7n7prmha3d44g3yuom",
        "bafkreiab2h3fpkg7rqxmxd6oazoxi7ngkke4dshud6acyjbqeievycy4lu",
        "bafkreig7t3idihcg4vnlor7xdfrhknm3lzx3s3o44dinqeiiztijjk5gte",
        "bafkreihphp5ap3junungjxj4vslb5bjndmwzoohod7wvkpfrffpcovctxm",
        "bafkreigkucdtiyp6v3aobk2rg2hyd6hceoh4grltpdint5zlxjan6wjahm",
        "bafkreibfipwrjln4chsdmnrerqbv5m62572kner5ulzbhykai2dqmi4oa4",
        "bafkreih2rvrziskqk7itkwnmg4vwhpdwkznzbb537ycybxyfafzusrb5qe",
        "bafkreie6ocamlp7djhpzjys7r7gvfkse3zpyc7rpdtnlh3owc7d4czlt6y",
        "bafkreif467mbh5rscn4xkgdetwgmtkymijl2yuu7cgj6hdabsmpfzhg2te",
        "bafkreiccohnhrltxlwsp3o5mgyfgidz44xy6xmhecvvm6fmvg2zl5lp5qm",
        "bafkreieiobksn5xu2jk73khbvfurzaczdvjfp7hwu2nq4c76jgqslob7ry",
        "bafkreigifw6ea3fw7iauiitkkjgktykqlklaff7zhyyhnx3qmfnbjitroe",
        "bafkreibdhsx44myawghoi55nm5s2ib4e2uieqk2gz5qphlpwjgti75rcjq",
        "bafkreice5n7j5tx7lbjophpy2fvotr56uxj4slkfb7o2wbnrxj5zuze22e",
        "bafkreiaqssgawbse5norqouimoexkneli35xcibcrsqg22rk7f3yl2cxhe",
        "bafkreietnqupbg5f73oxiwb4xr7fwzbjk2lxep55uziy7inetdpu5fj6m4",
        "bafkreihv6r26bvssx6wf4pbcusgj3b5i6v34xpb53f7a2mcwmlxbret4ny",
        "bafkreiamvuv4qprjkqxesptglbvqe7z766qwkcnrq2uaqxbzt4ux5v6pmu"
      ],
      //BNB main
      [
        "bafkreihv47bce65zx3uzielcwoki4ffrq6wiqi26r7davnphyscxa4tf5m",
        "bafkreih4dbnt6hqyktvybjjjl5e5odydh3bpgeyohun7zyatlfohxepfka",
        "bafkreidbxeptmitwbu7mzklufhqqvf2pj6myylxy6arbayfbmhnmb46mca",
        "bafkreidxqzri4x2j72kkqzvxx7xvjvrwpkmwgt4gycnmzzyjnmp7b2i7xu",
        "bafkreihwmnqwlretfc4bldb7sdmiscqptzu262m7dwde5hlugkpuvh56fu",
        "bafkreigg43d3fj65uxarazuk6erp4lvetqyxpwgdhcn3iv4nlwuh672t2i",
        "bafkreicg4xbdjuwntatect36g3bzwtsxkmnajx2yo4pk5ftasufcuhnn64",
        "bafkreiakmbqdqkboidaaa5kxxn74e7fc376c55jb2hs5mnwauqbld7kksi",
        "bafkreidg6pzgdtj6g3oib6bc4jludxjqpalla7xbvxbuvvwquqx4adj6cy",
        "bafkreifuvhiqy5f2vxfx5y5iwgv2d2cvlsfjertroxcbmiegcwwtoiei6q",
        "bafkreicclt6ledn4bq6nfrobgglq27nbut3vzdlj6y7izev5y4zlyqqs7y"
      ],
      //Cronos main
      [
        "bafkreiduz7eo5b26u75qgoqhq5y3zrfu7pe4gpbksaq2rh6l5dxqa4ohme",
        "bafkreigf7ba5qazilmzuzbkkbchvaccesfajspurn4or7p2tjtx7wsbsge",
        "bafkreigf6npkdxjdurc4eovqqi4vqb2lxfwsf3wytk2qlencvzmu27j7ke",
        "bafkreidnonoqynsz7inxeyofvoq7bskl66ahg46wdzbqyme2n4md3e4puy",
        "bafkreih3tkesxwpvhoq5ade7xoup3t7netlkefbqc3umyz6smymp6734uq",
        "bafkreicwwzd6r4foiwipp73ss3nmkqtdwfo6dxwo2thlgox4n4yzew5ary",
        "bafkreihum7yw6ngzeogcpckf5o5w6scectcrrgf5v5xg74pprerb2hrpdi",
        "bafkreigw5rekm454x6cdhiuv6yvzviknlshgsc7uxv7nbyvfaymnqywjlq",
        "bafkreiexmaethqlezewk2mcffkinyohq6ldvuzlwkwbnyquodfoegykhti",
        "bafkreigk4g24d5zs633gbbw5qcfsyixugj32ijqwiqyllqg6k7exq7apvi",
        "bafkreicio3uugzcfsypykvxvb4so5nlr3tvp7wkwnajngiyuabxiqmkoaa",
        "bafkreibrzpupauow2vmrwllk4q2qmzl3wioac5kvw6lzjjkdkks5ewgzpi",
        "bafkreifgoqqgc4rbchaicgwpmt5c2yjgn7hkxzfogv5r4rwz7lsmcys53m",
        "bafkreibbshzs7tl2wspdtwfhmeddu4x3do74ecnruzd45bozz73gjdxclm",
        "bafkreicqxnc3i5em5sxoruvkxndxf7f3urjxgi7wqbdyxu3wuqjg7tjlme",
        "bafkreifgrldswgdtt3fznt4b5o5f5zcn5tkr5s7f7z46kqvzu7faanmbjy",
        "bafkreihmvqmgj7cueszzvgv5h27uzpibv52yxsj2qeq6g7sjpcfsnuur3q",
        "bafkreihokjcvcqpjfps3ik2ugwbexazwmfcknb7kansxre3ozkayzn5j44",
        "bafkreiarxm6dd3r4t6kvridlgjzlckbmyynhz7lvjf3ah7w7vccmrt35kq",
        "bafkreigoj6fgsfr6xcelrgveiltksdk7on2vl2b6knt6jpo7vzcxjsigyy",
        "bafkreiate3hwstfrko6l3s3imhqtoz7u5oe6k7rr4g2jaapemrw67ueqpm",
        "bafkreicpeymjmwbrzvkkjxjpiwa2ehkfawymddtffyarsk33lngwvo2yom",
        "bafkreihdfosfmv5thbtvcxvolzfcznjzo5vx635emcui43smen7be2quwq",
        "bafkreiagxfgrtpdko3mzutfkluvof6rouivcwv3kpnqbtfodk57p7zcfhm",
        "bafkreialymmlp5ktpgvk6etirgvvrbnatwrogmdoyfnpyq5pob6l4yjagu",
        "bafkreigv3v3xgdko4oxj3lr3untjnpsrctj3dwrkttc2d3zovwdtswdlde",
        "bafkreiczf6fckmufcgarpgqur6nc6wbs5j233urxey65gtdtjpn7mcu2vy"
      ],
      //Eth main
      [
        "bafkreiccbbwofeaw22t7kql6edawlr7tqerdoctgmow3twkqy2clby64ru",
        "bafkreigxbmbrioxa2gjvvebzdkz5bi2kvnxwesmr2c4vlvyrkcvopgzddu",
        "bafkreiardow3yed4ykavwqiqeb2iscuh532dwdd2usljcbnaz5bntjfao4",
        "bafkreibmofw5qxt2vsg7ssrq5n3hpdzs4ra2jq3m4zcwphh3oxjjs6u5jy",
        "bafkreig7yrpv6f4b574of7cpbzfjqejitwjwcy7jzrfk3xiubgb7emdche",
        "bafkreigzbcmmjnpgllkmho7wlqnb4ezhka23d6ojpm6v5i6qajwz747yxm",
        "bafkreidbvodnz2rcizxzaa3rx7fmpykjpvqqtxxyzeax5si55paxq26v5e",
        "bafkreihl2vdonssm3ayqlhj3cwjnqtm3ob2axfvjbwy5tiesrem5yhzhqu",
        "bafkreiggqbolduhvouu3fd2gupxrve4mpsb4kmo7kbiotrff76jlkfl3ii",
        "bafkreiepyo7if4hha5mkjiy22glbxiyr2ovfuxgnwqkkyrx4vt62jpf6t4",
        "bafkreids544tpwx3heurd4bntzyzufmvxz5quqnl5st5tt6jot4snsrzhy"
      ],
      //Polygon main
      [
        "bafkreiflttfrdgosch35eczen2cvqss2e2ntx5jk77rjpinljks4ohshh4",
        "bafkreidlgypycqlm2l6v3fkjjyjtcnigf65k2mzv4ja45mk4a2d2u7lbve",
        "bafkreigxepmjltzzqv7ubwvwpkv3lc5llm2wf6nv6daepa7lhhubxlbxt4",
        "bafkreib4nyrvy7hc243cj4q3r7l67pf2qpvvdgmhfi2spgxbrydgnv2iuq",
        "bafkreidc4guo3kwrbil5poxmgzcpaxm6j6us7ruvjzorngbkryxgauyuii",
        "bafkreigrku6n6r32q3xwxkhjjxqm4aohj2jcwqvy3tszepldosvkvoyt5q",
        "bafkreihvvxyvcntyxdlwyuslyujuao5oot3i3yjftvybjaiagjuijffkzu",
        "bafkreiejc3bdhg4txd4e77vmlonajqf2m7d6vaivukqmjlqstkjwxg4nu4",
        "bafkreih275el4xdquvnlozii3hxdbn24yrbsfe3nfwgnkywuuaxebkxu2a",
        "bafkreiffuowb46lt3bdinyyab3bq4rzhas7v6nwampumt2ibmqsnysotau",
        "bafkreifki7uhbpc2f3zyzzlrafb3h45frj3scvutwhodgvk3c2gv6pwcaq",
        "bafkreidzsgp47oncszqp6ckzfee5nljqpmmun2olkx4n3xjnhbefflab2q",
        "bafkreihpur7niaprs6jn42s4aq4okg27qt7pvcsgimsufosymsy3s7bpfy",
        "bafkreigsxrgrnlwji3ot44qay52afuxlounquuktezwohiqrjj7lmlaifm",
        "bafkreieob4osh7crlo36nxiga5anvkkgvgquskl2m52hxgltm7bmsisp6i",
        "bafkreigzup6yapaluhy5gnrhyw6fvrvm7kohetko25o6cmhdiuygqelg5y",
        "bafkreihhpdvek7hxvdlxbethkkow7rtedskmmkiaiiaujxzcgx4uitxi7a",
        "bafkreihx3u7rqe3vuebla2rvvwzhsmbo47alp3i5kj2ayx65sd43loemva",
        "bafkreihufzgxzn63uirgmcgsrxt4lqgaltpgzbwuxy2zdnz2x5d3vjvucy"
      ],
      //Kovan
      [
        "bafkreiddpbovyl26phtoudm5datydraj52eh6pzfbdms4m2dlec2s6zmne",
        "bafkreibyazzlap6fgrgaxmge77zqc4ct7d3raffqx663p7p6x5b7lqnd7q",
        "bafkreieppliiek5ouqx52decjdsvk73uel5hpt65ljft4sjighf56juzl4",
        "bafkreigcnxuklyfxk5x2y6huybmzsv5rwgesa3unj5u2i4a6prah55lul4",
        "bafkreigkgdrxhvb4va3yrh6zrn7wjafcdqlpyodgmg5l4apbkf3dism5ku",
        "bafkreigejppvtxcpabl6xjewihrfgchsz3onyhaugbgs2bq67qbswkcjuq",
        "bafkreiftykijcjat7s6pgt4uu6lukq6ffdsymxx4u756eke7erl7jnkqny"
      ],
      //mumbai
      [
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
        "bafkreie2hae2wo7knywdrw6yn5yyf4pl6pxrni7buehmb64rrkmkpfrxjy",
        "bafkreig2suz3wgpxmdt7mr6agmoyjkt5qlwwnphemuzug4armvjtbldfqu"
      ],
      //bnb testnet
      [
        "bafkreibkaxecq7zkmaftsqgobuptqhdpzziz63kwrderndjt32ewrwjvry",
        "bafkreigo44i5q53kguubvf3hxdpucrnkdv6p3mlj25sneo344fe2lvprpu",
        "bafkreicsossgrclzqqmlqyixz6khbxft2bsnlggv65clnahpxds7cgleym",
        "bafkreihnyqlpulkr5s2i3nsgrsdej4cx2aeaoefmcz4nidgxd6z2ze2vn4",
        "bafkreidcj7rsoiu5yvlfxaglzf6dhr5pommbc3wsghqco4i55mpzs6fmx4",
        "bafkreiazee73pkeml6omzri22kvr5qdnn5nabfwof2wijl56cyrqfapsly",
        "bafkreiaihrlztjgmrhnx4qlhvzoglfz6bz4teekgbd2ww4fk7ezagjuk3u",
        "bafkreig2m2kgxaijwg62mkrmnbufjm3b5paej4iz6eznvegokrwpvzxc5y",
        "bafkreichnhgdysvw7phf7huxj5p7q544nbjlum4bwqr4mdson6tks4uoge",
        "bafkreicswjne5jmys6h4ezp6suxgkp3amghbmtomm2svwrxclnvy3j3twm",
        "bafkreigvruxnd5rsrsa5mvfvubl2dbscd3uuvqjxpy3hjj2f5eaqlkqiwa"
      ],
      //fuji testnet
      [
        "bafkreifen5lynaijzdk6kty2ggiq4ktvvorjelckkotejljww23po4yeci",
        "bafkreiby5fygarj6shigcnln4bl7vzmpierfzitmjsaezlcgp7jk6kn5hi"
      ]



    ]
    const flattenedCIDS = CIDS.reduce((result, current) => [...result, ...current], [])
    // console.log(flattened)
    for (let CID of flattenedCIDS) {
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

module.exports = {
  resetMigration,
  migrateFromCIDToDB,
  migrateOrdersToIPFS
}