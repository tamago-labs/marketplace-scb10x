const { db } = require("../../../firebase")

//The function below is for adding referencing the migration key of data, Do not Invoke
const addMigrationKey = async () => {
  const orders = await (await db.collection("orders").get()).docs.map(doc => { doc.ref.update({ isMigrated: false }) })
}
// addMigrationKey()