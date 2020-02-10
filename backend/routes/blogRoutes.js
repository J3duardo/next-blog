const express = require("express");
const {createBlog, getAllBlogs, getSingleBlog, getCategoriesAndTags, deleteBlog, updateBlog, getBlogPhoto} = require("../controllers/blogController");
const {protectRoute, adminMiddleware} = require("../controllers/authController");

const router = express.Router();

router.post("/blog", protectRoute, adminMiddleware, createBlog);
router.get("/blogs", getAllBlogs);
router.get("/blog/:slug", getSingleBlog);
router.get("/blog/:slug/photo", getBlogPhoto);
router.post("/blogs-categories-tags", getCategoriesAndTags);
router.delete("/blog/:slug", protectRoute, adminMiddleware, deleteBlog);
router.patch("/blog/:slug", protectRoute, adminMiddleware, updateBlog);

module.exports = router;