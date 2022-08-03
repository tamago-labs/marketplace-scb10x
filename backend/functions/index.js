const functions = require("firebase-functions");
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const fs = require("fs")

const { addFirestoreDataToAlgolia } = require("./services/algolia")
const { orderTrails } = require("./services/order-trails")
const { updateHistory } = require("./services/history-update");
const { updateCollections } = require("./services/update-collections");
const { reSyncMetaData, getNFTMetadata } = require("./v2/models/nfts");
const { importFrontEndV2CollectionsToDB } = require("./services/migrations/v2/collections");



// const { testSendingMail } = require("./sendgrid")

// initialize app
const app = express();
app.use(express.json({ limit: "50mb" }))
app.use(morgan("tiny"))
app.use(cors())


//test route
app.use("/testing", async (req, res, next) => {
  try {
    res.json({ message: "The testing endpoint functions correctly" })
  } catch (error) {
    next(error)
  }
})

//routes
fs.readdirSync("./routes").map(r => app.use("", require("./routes/" + r)))

fs.readdirSync("./v2/routes").map(r => app.use("/v2/", require("./v2/routes/" + r)))
//error handling

app.use((req, res) => {
  res.status(404).json({ message: "resource not found on this server" })
})

app.use((err, req, res, next) => {
  console.log({ err })
  res.status(500).json({ message: "internal server error" })
})


//The lines below provision cloud infrastructures
exports.api = functions.region('asia-east2').https.onRequest(app)
exports.pubsub = functions.region('asia-east2').pubsub.schedule('every 10 minutes').onRun(() => {
  orderTrails()
  updateHistory()
  return null
})
exports.updateCollections = functions.runWith({ timeoutSeconds: 540 }).region('asia-east2').pubsub.schedule('0 0 * * *').onRun(() => {
  updateCollections()
  return null
})

//Since Algolia search was configured to sync with firestore via console. uncommenting the code below is not necessary in most cases,
// exports.addFirestoreDataToAlgolia = functions.region('asia-east2').https.onRequest(
// )

// (Important!)DISABLE THE LINES BELOW BEFORE DEPLOYMENT

//LOCAL DEV ONLY : run node server on port 3000
// app.listen(process.env.PORT || 8000, () => {
//   console.log(`listening on port ${process.env.PORT || 8000}`)
// })

//LOCAL DEV ONLY : order fulfillment update
// orderTrails()
// updateHistory()
// addFirestoreDataToAlgolia()

//LOCAL DEV ONLY : test sending email
// testSendingMail()

//LOCAL DEV ONLY : updating collection database
// importFrontEndV2CollectionsToDB()