const {check} = require("express-validator");

exports.contactFormValidator = [
  check("name", "El nombre es obligatorio").not().isEmpty(),
  check("email", "El email es obligatorio").not().isEmpty(),
  check("email", "Email inválido").isEmail(),
  check("message", "El mensaje debe contener al menos 20 caracteres").not().isEmpty().isLength({min: 20})
]