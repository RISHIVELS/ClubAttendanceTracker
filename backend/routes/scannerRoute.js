const express = require("express");
const router = express.Router();

const { scannerController } = require("../controllers/scannerController");
const authMiddleware = require("../auth/authRoute");

router.route("/scan/:currentEventId").post(authMiddleware, scannerController);

module.exports = router;
