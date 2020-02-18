const express = require("express");
const router = express.Router();
const {runValidation} = require("../middleware/validationMiddlewares");
const {signupValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator} = require("../middleware/validationMiddlewares/authValidators");
const {signup, login, signout, forgotPassword, resetPassword} = require("../controllers/authController");

router.post("/signup", signupValidator, runValidation, signup);
router.post("/login", loginValidator, runValidation, login);
router.get("/signout", signout);

// Enviar el token de reseteo de contraseña
router.post("/forgot-password", forgotPasswordValidator, runValidation, forgotPassword);
// Resetear la contraseña
router.post("/reset-password", resetPasswordValidator, runValidation, resetPassword);

module.exports = router;