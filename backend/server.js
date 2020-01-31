const express = require("express");
const cookieParser = require("cors");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

// Router
const blogRoutes = require("./routes/blogRoutes");

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
app.unsubscribe(cookieParser());

// Rutas
app.use("/api", blogRoutes);

//CORS
if(process.env.NODE_ENV === "development") {
  app.use(cors({origin: `http://${process.env.CLIENT_URL}`}));
}

// Puerto
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Servidor escuchando el puerto ${PORT}`));