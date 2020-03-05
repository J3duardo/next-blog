const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const shortId = require("shortid");
const sendgridMail = require("@sendgrid/mail");
const {OAuth2Client} = require("google-auth-library");
sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: `${process.env.CLOUD_NAME}`,
  api_key: `${process.env.CLOUDINARY_API_KEY}`,
  api_secret: `${process.env.CLOUDINARY_API_SECRET}`
});

const CLIENT_URL = process.env.NODE_ENV !== "production" ? process.env.CLIENT_URL : process.env.CLIENT_URL_PROD

// Controller para registro de usuarios sin activación mediante comprobación de email
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
    let profile = `${CLIENT_URL}/profile/${username}`;

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

// Controller para registro de usuarios mediante comprobación de email
exports.preSignup = async (req, res) => {
  try {
    const {name, email, password, passwordConfirm} = req.body;

    // Chequear si ya existe un usuario con los mismos datos
    const user = await User.findOne({email: email.toLowerCase()});

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

    // Crear el token para comprobación mediante email
    const tokenPayload = {
      name,
      email,
      password,
      passwordConfirm
    }
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {expiresIn: "15m"});

    // Crear el email con la información del usuario
    const emailData = {
      to: email,
      from: "noreply@nextblog.com",
      subject: `Comprobación de su cuenta de ${process.env.APP_NAME}`,
      html: `
        <h4>Comprobación de su cuenta</h4>
        <p>Por favor, use el siguiente link para confirmar y activar su cuenta de ${process.env.APP_NAME}</p>
        <a href=${CLIENT_URL}/activate-account?token=${token}>${CLIENT_URL}/activate-account?token=${token}</a>
        <p style="text-align: center">El link es válido por 15 minutos, de no completar la operación en este periodo de tiempo tendrá que enviar un nuevo email</p>
        <hr/>
        <p>SeoBlog Team</p>
      `
    }

    // Enviar el email al usuario
    await sendgridMail.send(emailData);

    return res.json({
      status: "success",
      message: `Se ha enviado un email a ${email} con las instrucciones para activar su cuenta.`
    })

  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
      error: error.message
    })
  }
}

// Controller para crear el usuario una vez comprobado el email
exports.createAccount = async (req, res) => {
  try {
    const token = req.query.token;

    // Chequear si el token no ha expirado
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if(err) {
        return res.status(400).json({
          status: "failed",
          message: "Token expirado. Envíe un nuevo email para activar su cuenta."
        })
      }

      const {name, email, password, passwordConfirm} = decoded;

      // Crear el username y el profile
      let username = shortId.generate();
      let profile = `${CLIENT_URL}/profile/${username}`;

      try {
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
          message: "Su cuenta ha sido activada exitosamente. Inicie sesión con sus datos",
          data: {
            user: newUser
          }
        });
        
      } catch (error) {
        return res.status(500).json({
          status: "failed",
          message: "Internal server error",
          error: error.message
        })
      }
    });

  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
      error: error.message
    })
  }
}

// Controller para inicio de sesión
exports.login = async (req, res) => {
  console.log(CLIENT_URL)
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
      res.cookie("token", token, {expires: new Date(Date.now() + 24 * 3600 * 1000), httpOnly: true, secure: req.protocol === "https"});

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

// Controller para iniciar sesión con google
exports.googleLogin = async (req, res) => {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  try {
    const idToken = req.body.token;
    const clientResponse = await client.verifyIdToken({idToken, audience: process.env.GOOGLE_CLIENT_ID});
    const {email_verified, name, email, jti} = clientResponse.payload;

    // Verificar si el usuario ya existe
    const user = await User.findOne({email: email});

    // Si existe, enviarle el token de inicio de sesión
    if(user) {
      jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: "1d"}, (err, token) => {
        if(err) {
          return res.status(500).json({
            status: "failed",
            message: {...err},
            error: {...err}
          })
        }

        // Enviar el token en los cookies
        res.cookie("token", token, {expires: new Date(Date.now() + 24 * 3600 * 1000), httpOnly: true, secure: req.protocol === "https"});
        // Enviar token y data del usuario en la respuesta  
        return res.json({
          status: "success",
          message: "Sesión iniciada exitosamente",
          data: {
            token,
            user: {
              id: user._id,
              email: user.email,
              name: user.name,
              username: user.username,
              isGoogleUser: user.isGoogleUser,
              role: user.role
            }
          }
        })
      });
    } else {
      // Si el usuario no existe, crear un nuevo usuario con su información de google
      const username = shortId.generate();
      const profile = `${CLIENT_URL}/profile/${username}`;
      const password = jti;
      const passwordConfirm = jti;
      const isGoogleUser = true;

      const newUser = new User({name, email, username, profile, password, passwordConfirm, isGoogleUser});
      const response = await newUser.save();
      
      // Crear y enviar el token con la data del usuario
      jwt.sign({userId: response._id}, process.env.JWT_SECRET, {expiresIn: "1d"}, (err, token) => {
        if(err) {
          return res.status(500).json({
            status: "failed",
            message: {...err},
            error: {...err}
          })
        }
  
        // Enviar el token en los cookies
        res.cookie("token", token, {expires: new Date(Date.now() + 24 * 3600 * 1000), httpOnly: true, secure: req.protocol === "https"});

        return res.json({
          status: "success",
          message: "Sesión iniciada exitosamente",
          data: {
            token,
            user: {
              id: response._id,
              email: response.email,
              name: response.name,
              username: response.username,
              role: response.role,
              isGoogleUser: response.isGoogleUser
            }
          }
        })
      });
    }

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
        <a href=${CLIENT_URL}/reset-password?token=${resetPasswordToken}>${CLIENT_URL}/reset-password?token=${resetPasswordToken}</a>
        <p style="text-align: center">El link es válido por 10 minutos, de no completar la operación en este periodo de tiempo tendrá que enviar un nuevo email</p>
        <hr/>
        <p>Si usted no solicitó el restablecimiento de su contraseña, puede ignorar este mensaje</p>
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
    const {token, password, passwordConfirm} = req.body;

    // Chequear si se recibió el token
    if(!token) {
      return res.status(400).json({
        status: "failed",
        message: "Token inválido. Envíe un nuevo email de restablecimiento de contraseña."
      })
    }

    // Verificar que las contraseñas coincidan
    if(password !== passwordConfirm) {
      return res.status(400).json({
        status: "failed",
        message: "Las contraseñas no coinciden"
      })
    }

    // Buscar el usuario con el token enviado
    const user = await User.findOne({resetPasswordLink: token});
    if(!user) {
      return res.status(400).json({
        status: "failed",
        message: "Token inválido. Envíe un nuevo email de restablecimiento de contraseña."
      })
    }

    // Chequear si el token no ha expirado
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if(err) {
        return res.status(400).json({
          status: "failed",
          message: "Token expirado. Envíe un nuevo email de restablecimiento de contraseña."
        })
      }  
  
      // Crear y actualizar la nueva contraseña del usuario
      user.password = password;
      user.resetPasswordLink = "";

      try {
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
    });

  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
      error: {...error}
    })
  }
}

// Eliminar cuenta de usuario
exports.deleteUserAccount = async (req, res) => {
  try {
    // Chequear si hay contraseña
    if(req.body.password === "") {
      return res.status(400).json({
        status: "failed",
        message: "Debe agregar su contraseña"
      })
    }

    // Chequear si hay confirmación de contraseña
    if(req.body.passwordConfirm === "") {
      return res.status(400).json({
        status: "failed",
        message: "Debe confirmar su contraseña"
      })
    }

    // Chequear si las contraseñas coinciden
    if(req.body.password !== req.body.passwordConfirm) {
      return res.status(400).json({
        status: "failed",
        message: "Las contraseñas no coinciden"
      })
    }

    // Buscar el usuario y chequear si la contraseña es correcta
    const user = await User.findById(req.user.userId).select("+password");

    if(!user) {
      return res.status(404).json({
        status: "failed",
        message: "Usuario no encontrado"
      })
    }

    const check = await user.checkPassword(req.body.password, user.password);

    if(!check) {
      return res.status(400).json({
        status: "failed",
        message: "Contraseña incorrecta"
      })
    }

    // Eliminar la imagen avatar de Cloudinary
    await cloudinary.v2.uploader.destroy(user.avatarPublicId, {invalidate: true});

    // Eliminar el usuario si todo es correcto
    await user.remove();

    return res.json({
      status: "success",
      message: "Cuenta de usuario eliminada exitosamente"
    })

  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
      error: error.message
    })
  }
}