const {validationResult} = require("express-validator");

exports.runValidation = (req, res, next) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    return res.status(400).json({
      status: "failed",
      message: "Error de validación",
      error: errors.array()[0].msg
    })
  }

  next()
}