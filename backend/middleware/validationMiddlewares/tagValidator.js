const {check} = require("express-validator");

exports.tagValidator = [
  check("name", "Debe agregar el nombre del tag").not().isEmpty()
]