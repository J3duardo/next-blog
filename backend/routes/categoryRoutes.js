const express = require("express");
const router = express.Router();
const {protectRoute, adminMiddleware} = require("../controllers/authController");
const {createCategory, getCategory, getAllCategories, deleteCategory} = require("../controllers/categoryController");

const {runValidation} = require("../middleware/validationMiddlewares");
const {categoryValidator} = require("../middleware/validationMiddlewares/categoryValidator");

router.post("/category", categoryValidator, runValidation, protectRoute, adminMiddleware, createCategory);
router.get("/category/:slug", getCategory);
router.get("/categories", getAllCategories);
router.delete("/category/:slug", protectRoute, adminMiddleware, deleteCategory);

module.exports = router;