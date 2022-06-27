const algoliasearch = require("algoliasearch")
require("dotenv").config()
const { db } = require("../../firebase")

const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY);

addFirestoreDataToAlgolia = async (req, res) => {

  let collections = await db.collection("collections").get()
  collections = collections.docs.map(doc => ({ ...doc.data(), objectID: doc.id }))


  const index = client.initIndex(process.env.ALGOLIA_INDEX_NAME)

  index.saveObjects(collections, (err, data) => {
    res.status(200).send(data)
  })
}
module.exports = { addFirestoreDataToAlgolia, algoliaClient: client }