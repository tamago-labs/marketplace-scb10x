const functions = require("firebase-functions");
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const fs = require("fs")


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
fs.readdirSync("./routes").map(r => app.use("/api", require("./routes/" + r)))

//error handling

app.use((req, res) => {
  res.status(404).json({ message: "resource not found on this server" })
})

app.use((err, req, res, next) => {
  console.log({ err })
  res.status(500).json({ message: "internal server error" })
})

// (Important!)DISABLE THE lINES BELOW BEFORE DEPLOYMENT
app.listen(process.env.PORT || 3000, () => {
  console.log(`listening on port ${process.env.PORT || 3000}`)
})

exports.api = functions.https.onRequest(app)