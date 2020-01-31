const express = require("express");
const {time} = require("../controllers/blogController");

const router = express.Router();
router.get("/", time);

module.exports = router;