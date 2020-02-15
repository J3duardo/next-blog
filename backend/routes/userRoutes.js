const express = require("express");
const router = express.Router();
const {protectRoute, authMiddleware, readProfile} = require("../controllers/authController");
const {publicProfile, updateUserProfile, getUserPhoto} = require("../controllers/user");
const {check} = require("express-validator");

// Buscar el perfil del usuario actual
router.get("/user/profile", protectRoute, authMiddleware, readProfile);
// Buscar el perfil público de un usuario específico
router.get("/user/:username", publicProfile);
// Actualizar el perfil del usuario actual
router.patch("/user/update",
  protectRoute,
  authMiddleware, [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("name", "El nombre debe tener entre 5 y 30 caracteres").isLength({min: 5, max: 30}),
    check("email", "El email es requerido").not().isEmpty(),
    check("email", "Email inválido").isEmail()
  ],
  updateUserProfile);
// Buscar la foto del perfil de un usuario
router.get("/user/photo/:username", getUserPhoto);

module.exports = router;