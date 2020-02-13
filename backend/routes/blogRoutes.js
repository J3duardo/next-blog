const express = require("express");
const {createBlog, getAllBlogs, getSingleBlog, getBlogsCategoriesAndTags, deleteBlog, updateBlog, getBlogPhoto, getRelatedPosts, searchBlogs} = require("../controllers/blogController");
const {protectRoute, adminMiddleware} = require("../controllers/authController");

const router = express.Router();

// Crear un blog
router.post("/blog", protectRoute, adminMiddleware, createBlog);
// Buscar todos los blogs
router.get("/blogs", getAllBlogs);
// Buscar un blog específico
router.get("/blog/:slug", getSingleBlog);
// Buscar la imagen de un blog
router.get("/blog/:slug/photo", getBlogPhoto);
// Buscar todos los blogs, las categorías y los tags
router.post("/blogs-categories-tags", getBlogsCategoriesAndTags);
// Borrar un blog
router.delete("/blog/:slug", protectRoute, adminMiddleware, deleteBlog);
// Editar un blog
router.patch("/blog/:slug", protectRoute, adminMiddleware, updateBlog);
// Buscar los blogs relacionados
router.post("/blogs/blogs-related", getRelatedPosts);
// Buscar blogs mediante argumento de búsqueda
router.get("/blogs/search", searchBlogs)

module.exports = router;