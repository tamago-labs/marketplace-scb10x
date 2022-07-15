const validator = require("validator")
const { db } = require("../firebase")
const { ethers } = require("ethers");
const { WHITELISTED_ADDRESSES } = require("../constants")
const { recoverAddressFromMessageAndSignature } = require("../utils")
exports.getAllReports = async (req, res, next) => {
  try {
    let reports = await db.collection("reports").get()
    let result = []
    reports.forEach(doc => {
      result.push(doc.data())
    });
    return res.status(200).json({ status: "ok", reports: result })
  } catch (error) {
    next(error)
  }
}

exports.getReportByReporterAddress = async (req, res, next) => {
  try {
    const { address } = req.params
    if (!validator.isEthereumAddress(address)) {
      return res.status(400).json({ message: "Invalid address format." })
    }
    let reports = await db.collection("reports").where("reporterAddress", "==", String(address)).get()
    let result = []
    reports.forEach(doc => {
      result.push(doc.data())
    });
    return res.status(200).json({ status: "ok", reports: result })
  } catch (error) {
    next(error)
  }
}

exports.getReportByReportId = async (req, res, next) => {
  try {
    const { reportId } = req.params
    let reports = await db.collection("reports").where("reportId", "==", Number(reportId)).get()
    if (reports.empty) {
      return res.status(404).json({ message: "Report with this ID not found." })
    }
    let result = []
    reports.forEach(doc => {
      result.push(doc.data())
    });
    return res.status(200).json({ status: "ok", report: result[0] })

  } catch (error) {
    next(error)
  }
}

exports.createReport = async (req, res, next) => {
  try {
    const { message, signature, address, collectionAddress, comment, email } = req.body
    if (!message || !signature) {
      return res.status(400).json({ message: "Some inputs are missing." })
    }
    const recoveredAddress = recoverAddressFromMessageAndSignature(message, signature)
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(403).json({ message: "Access Denied" })
    }
    if (!collectionAddress || !comment || !email) {
      return res.status(400).json({ message: "Some required inputs missing." })
    }
    if (!validator.isEthereumAddress(collectionAddress)) {
      return res.status(400).json({ message: "Invalid contract address." })
    }
    if (email && !validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email address." })
    }
    if (typeof comment !== "string" || comment.length < 20) {
      return res.status(400).json({ message: "The comment should be descriptive and has at least 20 characters." })
    }
    const collection = await db.collection("collections").where("address", "==", collectionAddress).get()
    if (collection.empty) {
      return res.status(404).json({ message: "This collection does not exist in our database." })
    }
    //getting all reports
    const allReports = await db.collection("reports").get();
    const result = allReports.docs.map((doc) => ({
      id: doc.id,
    }));

    //assigning reportId
    const reportId = result.reduce((result, item) => {
      if (Number(item.reportId) > result) {
        result = Number(item.reportId)
      }
      return result
    }, 0) + 1
    console.log("Creating report with ID:", reportId)
    let data = {
      reporterAddress: address,
      collectionAddress,
      comment,
      email,
      reportId,
      resolved: false,
      rejected: false,
      adminComment: "",
      timestamp: Math.floor(new Date().valueOf() / 1000)
    }
    await db.collection("reports").add(data)
    return res.status(201).json({ status: "ok", reportId })
  } catch (error) {
    next(error)
  }
}
exports.updateReport = async (req, res, next) => {
  try {
    const { reportId } = req.params
    const { message, signature, resolved, rejected, adminComment } = req.body
    if (!message || !signature) {
      return res.status(400).json({ message: "Some inputs are missing." })
    }
    const recoveredAddress = recoverAddressFromMessageAndSignature(message, signature)
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(403).json({ message: "Access Denied" })
    }
    if (WHITELISTED_ADDRESSES.findIndex(item => item.toLowerCase() === recoveredAddress.toLowerCase()) === -1) {
      return res.status(403).json({ message: "Access Denied." })
    }
    let report = await db.collection("reports").where("reportId", "==", reportId).get()
    if (report.empty) {
      return res.status(404).json({ message: "Report with this ID does not exist." })
    }
    let newData = {
      resolved: false,
      rejected: false,
      adminComment: "",
    }
    if (resolved !== undefined) {
      newData.resolved = resolved
    }
    if (rejected !== undefined) {
      newData.rejected = rejected
    }
    if (adminComment !== undefined) {
      newData.adminComment = adminComment
    }
    await db.collection("reports").doc(report.docs[0].id).set(newData, { merge: true })

    return res.status(200).json({ status: "ok", updated: newData })

  } catch (error) {
    next(error)
  }
}
