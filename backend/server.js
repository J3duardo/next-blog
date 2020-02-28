const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

// Router
const blogRoutes = require("./routes/blogRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const tagRoutes = require("./routes/tagRoutes");
const contactFormRoutes = require("./routes/contactFormRoutes");

// Conectar con la base de datos
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
.then(() => {
  console.log("Base de datos conectada con éxito")
}).catch((err) => {
  console.log(`Error de conexión con la base de datos: ${err}`)
});

// App
const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Rutas
app.use("/api", blogRoutes);
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", tagRoutes);
app.use("/api", contactFormRoutes);

// Middleware para manejar errores de token
app.use((err, req, res, next) => {
  if(err.message.includes("jwt expired")) {
    res.clearCookie("token");
    res.status(401).json({
      status: "failed",
      message: "Sesión expirada. Inicie sesión nuevamente para continuar",
      error: "Sesión expirada. Inicie sesión nuevamente para continuar"
    });
    return;
  }
  if(err.name === 'UnauthorizedError') {
    res.status(401).json({
      status: "failed",
      error: "Debe iniciar sesión para acceder a este contenido",
      message: "Debe iniciar sesión para acceder a este contenido"
    });
    return;
  }
next();
});

// Puerto
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando el puerto ${PORT}`)
});