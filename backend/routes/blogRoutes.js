const express = require("express");
const {createBlog} = require("../controllers/blogController");
const {protectRoute, adminMiddleware} = require("../controllers/authController");

const router = express.Router();

router.post("/blog", protectRoute, adminMiddleware, createBlog);

module.exports = router;