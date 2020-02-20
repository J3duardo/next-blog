const User = require("../models/userModel");
const Blog = require("../models/blogModel");
const formidable = require("formidable");
const fs = require("fs");
const bcrypt = require("bcryptjs");

const CLIENT_URL = process.env.NODE_ENV !== "production" ? process.env.CLIENT_URL : process.env.CLIENT_URL_PROD

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
  try {
    // Chequear si el usuario existe
    const user = await User.findOne({_id: req.user.userId}).select("+password");
    if(!user) {
      return res.status(404).json({
        status: "failed",
        message: "Usuario no encontrado",
        error: "Usuario no encontrado"
      })
    }

    // Procesar la data ingresada en el formulario
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      try {
        if(err) {
          return res.status(400).json({
            status: "failed",
            message: "No se pudo procesar la información",
            error: "No se pudo procesar la información"
          })
        }
  
        // Extraer los campos del formulario
        const {username, name, email, currentPassword, password, passwordConfirm, about} = fields;
  
        // Validar el username
        if(username === "" || username.length < 5 || username.length > 30) {
          return res.status(400).json({
            status: "failed",
            message: "El username debe contener entre 5 y 30 caracteres"
          })
        }
  
        // Validar el nombre
        if(name === "" || name.length < 5 || name.length > 30) {
          return res.status(400).json({
            status: "failed",
            message: "El nombre debe contener entre 5 y 30 caracteres",
            error: "El nombre debe contener entre 5 y 30 caracteres"
          })
        }
  
        // Validar el email
        if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
          return res.status(400).json({
            status: "failed",
            message: "Debe introducir un email válido",
            error: "Debe introducir un email válido"
          })
        }
  
        // Validar la nueva contraseña
        if(currentPassword) {
          // Chequear si la contraseña es correcta antes de actualizarla
          const checkPassword = await user.checkPassword(currentPassword, user.password);
          if(!checkPassword) {
            return res.status(400).json({
              status: "failed",
              message: "Contraseña incorrecta",
              error: "Contraseña incorrecta",
            })
          }
          
          // Chequear si las contraseñas coinciden
          if(password !== passwordConfirm) {
            return res.status(400).json({
              status: "failed",
              message: "Las contraseñas no coinciden",
              error: "Las contraseñas no coinciden",
            })
          }
  
          // Chequear que la contraseña contenga al menos 6 caracteres
          if(password.length < 6) {
            return res.status(400).json({
              status: "failed",
              message: "La contraseña debe contener al menos 6 caracteres",
              error: "La contraseña debe contener al menos 6 caracteres"
            })
          }
  
          // Si todo es correcto, encriptar la nueva contraseña
          const updatedPassword = await bcrypt.hash(password, 12);
          await user.update({password: updatedPassword});
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
        user.profile = `${CLIENT_URL}/profile/${username}`;
  
        // Actualizar perfil en la base de datos
        await user.save();
    
        // No enviar la foto del perfil al cliente
        user.photo = null;

        // No enviar la contraseña del usuario al cliente
        user.password = null;
    
        // Enviar data actualizada del usuario
        return res.json({
          status: "success",
          message: "Perfil actualizado exitosamente",
          data: user
        });
        
      } catch (error) {
        // Manejo de errores de data duplicada
        if(error.code && error.code === 11000) {
          if(Object.keys(error.keyValue).includes("username")) {
            return res.status(400).json({
              status: "failed",
              message: "El username ya fue utilizado por otro usuario",
              error: error
            })
          }
          if(Object.keys(error.keyValue).includes("email")) {
            return res.status(400).json({
              status: "failed",
              message: "El email ya fue utilizado por otro usuario",
              error: error
            })
          }
        }
        return res.status(500).json({
          status: "failed",
          message: "Internal server error",
          error: error.message
        })       
      }
    }) 

  } catch (error) {
    // Manejo de errores globales del proceso de actualización
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
    const user = await User.findOne({username: req.params.username});

    // Chaequear si el usuario existe
    if(!user) {
      return res.status(404).json({
        status: "failed",
        message: "Usuario no encontrado",
        error: "Usuario no encontrado",
      })
    }

    // Si existe, buscar su foto y enviarla al cliente
    if(user.photo) {
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