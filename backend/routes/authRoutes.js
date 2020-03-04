const express = require("express");
const router = express.Router();
const expressLimiter = require("express-rate-limit");
const {runValidation} = require("../middleware/validationMiddlewares");
const {signupValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator} = require("../middleware/validationMiddlewares/authValidators");
const {preSignup, signup, createAccount, login, googleLogin, signout, forgotPassword, resetPassword, deleteUserAccount, protectRoute} = require("../controllers/authController");

// Limitar el número de cuentas creadas desde la misma IP a 10 cada media hora
const signupLimiter = expressLimiter({
  windowMs: 30 * 60 * 1000,
  max: 10,
  message: {status: "failed", message: "Demasiadas cuentas creadas desde esta IP. Intente de nuevo más adelante"}
});

// Limitar el número de intentos de login a 6 cada 10 minutos
const loginLimiter = expressLimiter({
  windowMs: 10 * 60 * 1000,
  max: 6,
  message: {status: "failed", message: "Demasiados intentos de login. Por favor intente más adelante."}
});

// Limitar el número de solicitudes de restablecimiento de contraseñas a 5 por hora
const forgotPasswordLimiter = expressLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: {status: "failed", message: "Ha realizado demasiadas solicitudes. Intente de nuevo más adelante"}
})

// Registrar usuarios implementando activación de cuenta por email
router.post("/pre-signup", signupLimiter, signupValidator, runValidation, preSignup);
// Registrar usuarios sin implementar activación de cuenta por email
router.post("/signup", signupLimiter, signupValidator, runValidation, signup);
// Iniciar sesión
router.post("/login", loginLimiter, loginLimiter, loginValidator, runValidation, login);
// Iniciar sesión con google
router.post("/google-login", googleLogin);
// Cerrar sesión
router.get("/signout", signout);

// Activar la cuenta del usuario
router.get("/activate-account", createAccount);
// Enviar el token de reseteo de contraseña
router.post("/forgot-password", forgotPasswordValidator, runValidation, forgotPasswordLimiter, forgotPassword);
// Resetear la contraseña
router.post("/reset-password", resetPasswordValidator, runValidation, resetPassword);
// Eliminar cuenta de usuario
router.post("/delete-account", protectRoute, deleteUserAccount);

module.exports = router;