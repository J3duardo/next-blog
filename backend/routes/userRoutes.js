const express = require("express");
const router = express.Router();
const {protectRoute, authMiddleware, readProfile} = require("../controllers/authController");
const {publicProfile, updateUserProfile, getUserPhoto} = require("../controllers/user");
const {createBlog, deleteBlog, updateBlog} = require("../controllers/blogController");

// Buscar el perfil del usuario actual
router.get("/user/profile", protectRoute, authMiddleware, readProfile);
// Buscar el perfil público de un usuario específico
router.get("/user/:username", publicProfile);
// Actualizar el perfil del usuario actual
router.patch("/user/update", protectRoute, authMiddleware, updateUserProfile);
// Buscar la foto del perfil de un usuario
router.get("/user/photo/:username", getUserPhoto);

// Permitir que los usuarios autenticados creen blogs
router.post("/user/blog", protectRoute, authMiddleware, createBlog);
// Borrar un blog
router.delete("/user/blog/:slug", protectRoute, authMiddleware, deleteBlog);
// Editar un blog
router.patch("/user/blog/:slug", protectRoute, authMiddleware, updateBlog);

module.exports = router;