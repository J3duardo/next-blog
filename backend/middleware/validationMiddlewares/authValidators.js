const {check} = require("express-validator");

// Validar data al registrar un nuevo usuario
exports.signupValidator = [
  check("name", "El nombre es obligatorio").not().isEmpty(),
  check("name", "El nombre debe tener entre 5 y 30 caracteres").isLength({min: 5, max: 30}),
  check("email", "El email es requerido").not().isEmpty(),
  check("email", "Email inválido").isEmail(),
  check("password", "La contraseña es requerida").not().isEmpty(),
  check("password", "La contraseña debe contener al menos 6 caracteres").isLength({min: 6, max: undefined}),
  check("passwordConfirm", "Debe confirmar su contraseña").not().isEmpty()
];

// Validar data al hacer login
exports.loginValidator = [
  check("email", "Debe ingresar su email").not().isEmpty(),
  check("email", "Email inválido.").isEmail(),
  check("password", "Debe ingresar su contraseña").not().isEmpty()
];

// Validar email para reseteo de contraseña
exports.forgotPasswordValidator = [
  check("email", "Debe ingresar su email").not().isEmpty(),
  check("email", "Email inválido.").isEmail()
];

// Validar la nueva contraseña
exports.resetPasswordValidator = [
  check("password", "Debe ingresar su contraseña").not().isEmpty(),
  check("password", "La contraseña debe contener al menos 6 caracteres").isLength({min: 6, max: undefined}),
  check("passwordConfirm", "Debe confirmar su contraseña").not().isEmpty()
];