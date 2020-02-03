const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const shortId = require("shortid");

// Controller para registro de usuarios
exports.signup = async (req, res) => {
  const {name, email, password, passwordConfirm} = req.body;

  try {
    // Chequear si ya existe un usuario con los mismos datos
    const user = await User.findOne({email: req.body.email});
    if(user) {
      return res.status(400).json({
        status: "failed",
        error: "Ya existe un usuario con el email ingresado"
      })
    }

    // Chequear si las contraseñas coinciden
    if(password !== passwordConfirm) {
      return res.status(400).json({
        status: "failed",
        message: "Error de validación",
        error: "Las contraseñas no coinciden"
      })
    }

    // Crear el username y el profile
    let username = shortId.generate();
    let profile = `${process.env.CLIENT_URL}/profile/${username}`;

    // Crear el nuevo usuario
    const newUser = await User.create({
      name,
      username,
      email,
      profile,
      password,
      passwordConfirm
    });
  
    return res.json({
      status: "success",
      message: "Usuario agregado exitosamente. Inicie sesión con sus datos",
      data: {
        user: newUser
      }
    })
    
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
      error: error.message
    })
  }
};

// Controller para inicio de sesión
exports.login = async (req, res) => {
  try {
    // Chequear si el usuario existe
    const user = await User.findOne({email: req.body.email}).select("+password");
  
    if(!user) {
      return res.status(404).json({
        status: "failed",
        error: "No existe un usuario asociado al email ingresado"
      })
    };
  
    // Chequear si la contraseña es correcta
    if(!(await user.checkPassword(req.body.password, user.password))) {
      return res.status(400).json({
        status: "failed",
        error: "Contraseña incorrecta"
      })
    };
  
    // Generar el token de autenticación
    //Crear el token de autorización y enviarlo al cliente
    const tokenPayload = {
      user: {
        id: user._id
      }
    }
  
    jwt.sign(tokenPayload, process.env.JWT_SECRET, {expiresIn: "1d"}, (err, token) => {
      if(err) {
        return res.status(500).json({
          status: "failed",
          error: {...err}
        })
      }

      // Enviar el token en los cookies
      res.cookie("token", token, {expiresIn: "1d"});

      // Enviar el token y la data del usuario en la respuesta
      return res.json({
        status: "success",
        message: "Sesión iniciada exitosamente",
        data: {
          user: {
            id: user._id,
            username: user.username,
            name: user.name,
            email: user.email
          },
          token
        }
      })
    });
    
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
      error: error
    })
  }
}

// Controller para cerrar sesión de usuario
exports.signout = async (req, res) => {
  res.clearCookie("token");
  res.json({
    status: "success",
    message: "Sesión finalizada correctamente"
  })
}

// Controller para prevenir acceso a rutas que requieran autenticación
exports.protectRoute = expressJwt({
  secret: process.env.JWT_SECRET
})