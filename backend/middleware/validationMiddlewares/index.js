const {validationResult} = require("express-validator");

exports.runValidation = (req, res, next) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    return res.status(400).json({
      status: "failed",
      message: errors.array()[0].msg,
      error: errors.array()[0].msg
    })
  }

  next()
}