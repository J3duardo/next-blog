const express = require("express");
const router = express.Router();
const {runValidation} = require("../middleware/validationMiddlewares");
const {signupValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator} = require("../middleware/validationMiddlewares/authValidators");
const {preSignup, signup, createAccount, login, googleLogin, signout, forgotPassword, resetPassword} = require("../controllers/authController");

// Registrar usuarios implementando activación de cuenta por email
router.post("/pre-signup", signupValidator, runValidation, preSignup);
// Registrar usuarios sin implementar activación de cuenta por email
router.post("/signup", signupValidator, runValidation, signup);
// Iniciar sesión
router.post("/login", loginValidator, runValidation, login);
// Iniciar sesión con google
router.post("/google-login", googleLogin);
// Cerrar sesión
router.get("/signout", signout);

// Activar la cuenta del usuario
router.get("/activate-account", createAccount);
// Enviar el token de reseteo de contraseña
router.post("/forgot-password", forgotPasswordValidator, runValidation, forgotPassword);
// Resetear la contraseña
router.post("/reset-password", resetPasswordValidator, runValidation, resetPassword);

module.exports = router;