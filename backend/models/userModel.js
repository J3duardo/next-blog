const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    maxlength: 30,
    unique: [true, "Username no disponible"],
    index: true,
    lowercase: true
  },
  name: {
    type: String,
    trim: true,
    required: true,
    maxlength: 30
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    lowercase: true
  },
  profile: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: true,
    select: false
  },
  about: {
    type: String,
    default: ""
  },
  role: {
    type: Number,
    default: 0
  },
  photo: {
    data: Buffer,
    contentType: String
  },
  resetPasswordLink: {
    data: String,
    default: ""
  }
}, {timestamps: true});

//Encriptar la contraseña del usuario
userSchema.pre("save", async function(next) {
  // En caso de ejecutar otra operación de guardado, no volver a encriptar la contraseña si ésta ya fue encriptada
  if (!this.isModified("password")) {
    return next()
  }
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = null;
  next();
});

//Verificar si la contraseña ingresada es correcta
userSchema.methods.checkPassword = async function(providedPassword, realPassword) {
  return await bcrypt.compare(providedPassword, realPassword);
}

module.exports = mongoose.model("User", userSchema);