const express = require("express");
const router = express.Router();

const {
  createCoordinator,
  loginCoordinator,
  logout,
} = require("../controllers/coordinatorController");

router.route("/register").post(createCoordinator);
router.route("/login").post(loginCoordinator);
router.route("/logout").get(logout);
module.exports = router;
