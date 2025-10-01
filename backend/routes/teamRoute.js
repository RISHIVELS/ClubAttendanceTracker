const express = require("express");
const router = express.Router();

const {
  createTeam,
  getAllTeams,
  getSingleTeam,
} = require("../controllers/teamController");
const authMiddleware = require("../auth/authRoute");

router.route("/event/:eventId").post(createTeam);
router.route("/").get(authMiddleware, getAllTeams);
router.route("/:id").get(authMiddleware, getSingleTeam);
module.exports = router;
