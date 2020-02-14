const express = require("express");
const router = express.Router();
const {protectRoute, authMiddleware, readProfile} = require("../controllers/authController");
const {publicProfile} = require("../controllers/user");

router.get("/profile", protectRoute, authMiddleware, readProfile);
router.get("/user/:username", publicProfile);

module.exports = router;