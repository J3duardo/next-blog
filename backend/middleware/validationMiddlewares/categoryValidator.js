const {check} = require("express-validator");

exports.categoryValidator = [
  check("name", "Debe agregar un nombre a la categoría").not().isEmpty()
]