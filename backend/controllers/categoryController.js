const Category = require("../models/categoryModel");
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
      message: "Categoría agregada exitosamente",
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

// Controller para tomar una categoría
exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findOne({slug: req.params.slug});

    if(!category) {
      return res.status(404).json({
        status: "failed",
        message: "Categoría no encontrada"
      })
    }

    return res.json({
      status: "success",
      message: "Categoría encontrada con éxito",
      data: {
        category
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
      message: "Categoría eliminada exitosamente"
    })

  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
      error: error
    })
  }
}