const { db } = require("../firebase")

exports.dbGetBannedCollections = async () => {
  try {
    const bannedCollections = await db.collection("collections")
      //IMPORTANT UNCOMMENT THE LINE BELOW
      .where("isBanned", "==", true)
      .get()
    if (bannedCollections.empty) {
      return []
    }
    return bannedCollections.docs.map(doc => ({ ...doc.data() }))
  } catch (error) {
    console.log(error)
  }
}