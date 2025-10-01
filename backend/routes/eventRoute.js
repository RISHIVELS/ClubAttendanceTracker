const express = require("express");
const router = express.Router();

const {
  createEvent,
  getAllEvents,
  getSingleEvent,
} = require("../controllers/eventController");
const authMiddleware = require("../auth/authRoute");

router
  .route("/")
  .post(authMiddleware, createEvent)
  .get(authMiddleware, getAllEvents);
router.route("/:id").get(authMiddleware, getSingleEvent);
module.exports = router;
