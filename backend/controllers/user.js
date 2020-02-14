const User = require("../models/userModel");
const Blog = require("../models/blogModel");

// Buscar el perfil público del usuario
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