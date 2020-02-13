const Category = require("../models/categoryModel");
const Blog = require("../models/blogModel");
const slugify = require("slugify");

// Controller para crear categorías
exports.createCategory = async (req, res) => {
  try {
    const {name} = req.body;
    const slug = slugify(name).toLowerCase();
    const category = await Category.create({
      name,
      slug
    });

    return res.json({
      status: "success",
      message: `Categoría ${name} agregada exitosamente`,
      data: {
        category
      }
    });

  } catch (error) {
    if(error.code && error.code === 11000) {
      return res.status(400).json({
        status: "failed",
        message: "Esta categoría ya existe",
        error
      })
    }
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
      error: error
    })
  }
}

// Controller para buscar los blogs de una categoría
exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findOne({slug: req.params.slug});

    // Chequear si la categoría buscada existe
    if(!category) {
      return res.status(404).json({
        status: "failed",
        message: "Categoría no encontrada"
      })
    }

    // Si existe, buscar los blogs asociados a esa categoría
    const blogs = await Blog.find({categories: category})
    .populate("categories", "_id name slug")
    .populate("tags", "_id name slug")
    .populate("postedBy", "_id name")
    .select("_id title slug excerpt categories postedBy tags createdAt updatedAt")

    return res.json({
      status: "success",
      message: "",
      data: {category, blogs}
    })

  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
      error: error
    })
  }
}

// Controller para tomar todas las categorías
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    return res.json({
      status: "success",
      message: "Se muestran todas las categorías existentes",
      data: {
        categories
      }
    })

  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
      error: error
    })
  }
}

// Controller para eliminar una categoría
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOne({slug: req.params.slug});

    if(!category) {
      return res.status(404).json({
        status: "failed",
        message: "Categoría no encontrada"
      })
    }
    
    await Category.findOneAndDelete({slug: req.params.slug});

    return res.json({
      status: "success",
      message: `Categoría ${category.name} eliminada`
    })

  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
      error: error
    })
  }
}