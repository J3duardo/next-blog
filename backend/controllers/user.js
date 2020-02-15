const User = require("../models/userModel");
const Blog = require("../models/blogModel");
const formidable = require("formidable");
const fs = require("fs");
const {validationResult} = require("express-validator");

// Buscar el perfil público de un usuario específico
exports.publicProfile = async (req, res) => {
  try {
    const user = await User.findOne({username: req.params.username}).select("-photo")

    // Chequear si el usuario existe
    if(!user) {
      return res.status(404).json({
        status: "failed",
        message: "Usuario no encontrado",
        error: "Usuario no encontrado"
      })
    }
    
    // Buscar los blogs del usuario
    const userBlogs = await Blog.find({postedBy: user._id})
    .populate("categories", "_id name slug")
    .populate("tags", "_id name slug")
    .populate("postedBy", "_id name")
    .select("_id title slug excerpt categories tags postedby createdAt updatedAt")
    .limit(10)

    return res.json({
      status: "success",
      data: {user, userBlogs}
    })

  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
      error: error.message
    })
  }
}

// Actualizar perfil del usuario actual
exports.updateUserProfile = async (req, res) => {
  // Validar name y email
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({
      status: "failed",
      message: errors.array()[0].msg,
      error: errors.array()[0].msg
    })
  }

  try {
    // Procesar la data ingresada en el formulario
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if(err) {
        return res.status(400).json({
          status: "failed",
          message: "No se pudo procesar la información",
          error: "No se pudo procesar la información"
        })
      }  

      // Chequear si el usuario existe
      const user = await User.findOne({email: req.user.email});      
      if(!user) {
        return res.status(404).json({
          status: "failed",
          message: "Usuario no encontrado",
          error: "Usuario no encontrado"
        })
      }

      // Extraer los campos del formulario
      const {username, name, email, about} = fields;

      // Validar el username
      if(username === "") {
        return res.status(400).json({
          status: "failed",
          message: "El username es obligatorio"
        })
      }
      if(username.length > 30) {
        return res.status(400).json({
          status: "failed",
          message: "El username no puede contener más de 30 caracteres"
        })
      }

      // Validar el nuevo email ingresado
      if(user.email !== email) {
        const checkNewEmail = await User.findOne({email: email});
        if(checkNewEmail) {
          return res.status(400).json({
            status: "failed",
            message: "Ya existe un usuario asociado al email ingresado",
            error: "Ya existe un usuario asociado al email ingresado"
          })
        }
      }

      // Validar que la foto del perfil no sea mayor de 1MB
      if(files.photo) {
        if(files.photo.size > 1000000) {
          return res.status(400).json({
            status: "failed",
            message: "La foto no debe ser mayor de 1MB",
            error: "La foto no debe ser mayor de 1MB"
          });
        }
        user.photo.data = fs.readFileSync(files.photo.path);
        user.photo.contentType = files.photo.type;
      }

      // Actualizar información del usuario
      user.username = username;
      user.name = name;
      user.email = email;
      user.about = about;
      user.profile = `${process.env.CLIENT_URL}/profile/${username}`;

      // Actualizar perfil en la base de datos
      await user.save();

      // No enviar la foto del perfil al cliente
      user.photo = null;

      return res.json({
        status: "success",
        message: "Perfil actualizado exitosamente",
        data: user
      })
    });

  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
      error: error.message
    })
  }
}

// Buscar foto del perfil del usuario
exports.getUserPhoto = async (req, res) => {
  try {
    // Buscar el usuario
    const user = await User.find({username: req.params.username});

    // Chaequear si el usuario existe
    if(!user) {
      return res.status(404).json({
        status: "failed",
        message: "Usuario no encontrado",
        error: "Usuario no encontrado",
      })
    }

    // Si existe, buscar su foto y enviarla al cliente
    if(user.photo.data) {
      res.set("Content-Type", user.photo.contentType);
      return res.send(user.photo.data);
    }

  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
      error: error.message
    })
  }
}