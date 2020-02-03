const {check} = require("express-validator");

// Validar data al registrar un nuevo usuario
exports.signupValidator = [
  check("username", "El username es obligatorio").exists(),
  check("username", "El username debe tener entre 4 y 30 caracteres").isLength({min: 4, max: 30}),
  check("name", "El nombre es obligatorio").exists(),
  check("name", "El nombre debe tener entre 5 y 30 caracteres").isLength({min: 5, max: 30}),
  check("email", "El email es requerido").exists(),
  check("email", "Email inválido").isEmail(),
  check("password", "La contraseña es requerida").exists(),
  check("password", "La contraseña debe contener al menos 6 caracteres").isLength({min: 6, max: undefined}),
  check("passwordConfirm", "Debe confirmar su contraseña").exists()
];

// Validar data al hacer login
exports.loginValidator = [
  check("email", "Debe ingresar su email").exists(),
  check("email", "Email inválido.").isEmail(),
  check("password", "Debe ingresar su contraseña")
]