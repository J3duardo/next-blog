const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const shortId = require("shortid");
const sendgridMail = require("@sendgrid/mail");
sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

// Controller para registro de usuarios
exports.signup = async (req, res) => {
  const {name, email, password, passwordConfirm} = req.body;

  try {
    // Chequear si ya existe un usuario con los mismos datos
    const user = await User.findOne({email: req.body.email});
    if(user) {
      return res.status(400).json({
        status: "failed",
        message: "Ya existe un usuario asociado al email ingresado",
        error: "Ya existe un usuario asociado al email ingresado"
      })
    }

    // Chequear si las contraseñas coinciden
    if(password !== passwordConfirm) {
      return res.status(400).json({
        status: "failed",
        message: "Las contraseñas no coinciden",
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
        message: "No existe un usuario asociado al email ingresado",
        error: "No existe un usuario asociado al email ingresado",
      })
    };
  
    // Chequear si la contraseña es correcta
    if(!(await user.checkPassword(req.body.password, user.password))) {
      return res.status(400).json({
        status: "failed",
        message: "Contraseña incorrecta",
        error: "Contraseña incorrecta",
      })
    };
  
    // Generar el token de autenticación
    //Crear el token de autorización y enviarlo al cliente
    const tokenPayload = {
      userId: user._id
    }
  
    jwt.sign(tokenPayload, process.env.JWT_SECRET, {expiresIn: "1d"}, (err, token) => {
      if(err) {
        return res.status(500).json({
          status: "failed",
          message: {...err},
          error: {...err}
        })
      }

      // Enviar el token en los cookies
      res.cookie("token", token, {expiresIn: "1d", httpOnly: true, secure: req.protocol === "https"});

      // Enviar el token y la data del usuario en la respuesta
      return res.json({
        status: "success",
        message: "Sesión iniciada exitosamente",
        data: {
          user: {
            id: user._id,
            role: user.role,
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

// Controller para tomar data del perfil del usuario autenticado
exports.readProfile = (req, res) => {
  return res.json({
    profile: req.profile
  })
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

// Middleware de autenticación: Chequea si hay usuario autenticado mediante el token guardado en los cookies
exports.authMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById({_id: req.user.userId});

    if(!user) {
      return res.status(404).json({
        status: "failed",
        message: "El usuario ingresado no existe",
        error: "El usuario ingresado no existe"
      })
    }

    req.profile = user;
    next();

  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
      error: error
    })
  }
}

// Middleware para otorgar acceso sólo a administradores
exports.adminMiddleware = async (req, res, next) => {
  try {
    const admin = await User.findById({_id: req.user.userId});

    if(!admin || admin && admin.role !== 1) {
      return res.status(401).json({
        status: "failed",
        message: "Acceso denegado: Necesita provilegios de administrador para ejecutar esta acción",
        error: "Acceso denegado: Necesita provilegios de administrador para ejecutar esta acción"
      })
    }

    req.profile = admin;
    next();

  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
      error: error
    })
  }
}

// Enviar token de reseteto de contraseña
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({email: req.body.email});
    if(!user) {
      return res.status(404).json({
        status: "failed",
        message: "No existe un usuario asociado al email ingresado"
      })
    };

    const resetPasswordToken = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: "10m"});

    // Data del email con la información para resetear la contraseña
    const emailData = {
      to: req.body.email,
      from: "noreply@nextblog.com",
      subject: `Restablecimiento de su contraseña de ${process.env.APP_NAME}`,
      html: `
        <h4>Restablecimiento de contraseña</h4>
        <p>Por favor, use el siguiente link para restablecer la contraseña de su cuenta de ${process.env.APP_NAME}</p>
        <a href=${process.env.CLIENT_URL}/auth/password-reset/${resetPasswordToken}>${process.env.CLIENT_URL}/auth/password-reset/${resetPasswordToken}</a>
        <hr/>
        <p>Si no solicitó el restablecimiento de su contraseña, puede ignorar este mensaje</p>
        <hr/>
        <p>SeoBlog Team</p>
      `
    }

    // Guardar el token en la base de datos
    await user.updateOne({resetPasswordLink: resetPasswordToken});

    // Enviar el email y responder al cliente
    await sendgridMail.send(emailData);
    return res.json({
      status: "success",
      message: "Se envió un email con instrucciones para restablecer su contraseña"
    })

  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
      error: {...error}
    })
  }
}

// Resetear la contraseña
exports.resetPassword = async (req, res) => {
  try {
    const {resetPasswordLink, password, passwordConfirm} = req.body;

    // Chequear si el token no ha expirado
    // Si el token expiró, lanza error con message: "jwt expired"
    jwt.verify(resetPasswordLink, process.env.JWT_SECRET);

    // Verificar que las contraseñas coincidan
    if(password !== passwordConfirm) {
      return res.status(400).json({
        status: "failed",
        message: "Las contraseñas no coinciden"
      })
    }

    // Buscar el usuario con el token enviado
    const user = await User.findOne({resetPasswordLink});
    if(!user) {
      return res.status(400).json({
        status: "failed",
        message: "Token inválido"
      })
    }

    // Crear y actualizar la nueva contraseña del usuario
    user.password = password;
    user.resetPasswordLink = "";
    await user.save();

    return res.json({
      status: "success",
      message: "Contraseña actualizada exitosamente"
    })

  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
      error: {...error}
    })
  }
}