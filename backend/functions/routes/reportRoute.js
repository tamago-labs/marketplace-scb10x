const express = require("express")
const router = express.Router();
const reportController = require("../controllers/reportController")


router.get("/report/", reportController.getAllReports)
router.get("/report/reporter-address/:address", reportController.getReportByReporterAddress)
router.get("/report/report-id/:reportId", reportController.getReportByReportId)
router.post("/report/create", reportController.createReport)
router.post("/report/update/:reportId", reportController.updateReport)


module.exports = router;