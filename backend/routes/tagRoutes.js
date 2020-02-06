const express = require("express");
const router = express.Router();
const {protectRoute, adminMiddleware} = require("../controllers/authController");
const {createTag, getTag, getAllTags, deleteTag} = require("../controllers/tagController");

const {runValidation} = require("../middleware/validationMiddlewares");
const {tagValidator} = require("../middleware/validationMiddlewares/tagValidator");

router.post("/tag", tagValidator, runValidation, protectRoute, adminMiddleware, createTag);
router.get("/tag/:slug", getTag);
router.get("/tags", getAllTags);
router.delete("/tag/:slug", protectRoute, adminMiddleware, deleteTag);

module.exports = router;