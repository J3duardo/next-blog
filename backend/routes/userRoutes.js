const express = require("express");
const router = express.Router();
const {protectRoute, authMiddleware, readProfile} = require("../controllers/authController");

router.get("/profile", protectRoute, authMiddleware, readProfile);

module.exports = router;