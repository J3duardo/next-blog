const express = require("express");
const router = express.Router();
const {runValidation} = require("../middleware/validationMiddlewares");
const {signupValidator, loginValidator} = require("../middleware/validationMiddlewares/authValidators");
const {signup, login, signout} = require("../controllers/authController");

router.post("/signup", signupValidator, runValidation, signup);
router.post("/login", loginValidator, runValidation, login);
router.get("/signout", signout);

module.exports = router;