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
    let reports = await db.collection("reports").where("reportId", "==", String(reportId)).get()
    let result = []
    reports.forEach(doc => {
      result.push(doc.data())
    });
    return res.status(200).json({ status: "ok", reports: result })


  } catch (error) {
    next(error)
  }
}

exports.createReport = async (req, res, next) => {
  try {
    const { message, signature, address, collectionAddress, comment, email } = req.body
    if (!message || !signature) {
      res.status(400).json({ message: "Some inputs are missing." })
    }
    const recoveredAddress = recoverAddressFromMessageAndSignature(message, signature)
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      res.status(403).json({ message: "Access Denied" })
    }
    if (!collectionAddress || !comment || !email) {
      res.status(400).json({ message: "Some required inputs missing." })
    }
    if (!validator.isEthereumAddress(collectionAddress)) {
      return res.status(400).json({ message: "Invalid contract address." })
    }
    if (email && !validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email address." })
    }


    //getting all reports
    const allReports = await db.collection("reports").get();
    const result = allDisputes.docs.map((doc) => ({
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
    const { message, signature, address } = req.body
    if (!message || !signature) {
      res.status(400).json({ message: "Some inputs are missing." })
    }
    //TODO recover address from message and signature
    const recoveredAddress = recoverAddressFromMessageAndSignature(message, signature)
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      res.status(403).json({ message: "Access Denied" })
    }
    //TODO validate if is admin

    //TODO 

  } catch (error) {
    next(error)
  }
}
