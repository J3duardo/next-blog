const express = require("express");
const router = express.Router();
const {contactForm, contactAuthor} = require("../controllers/contactFormController");
const {contactFormValidator} = require("../middleware/validationMiddlewares/contactFormValidator");
const {runValidation} = require("../middleware/validationMiddlewares");

// Ruta para enviar mensajes al adminitrador de la aplicación
router.post("/contact", contactFormValidator, runValidation, contactForm);
// Ruta para enviar mensajes al autor de un blog
router.post("/contact-author", contactFormValidator, runValidation, contactAuthor);

module.exports = router;