const Tag = require("../models/tagModel");
const slugify = require("slugify");

// Controller para crear tags
exports.createTag = async (req, res) => {
  try {
    const {name} = req.body;
    const slug = slugify(name).toLowerCase();
    const tag = await Tag.create({
      name,
      slug
    });

    return res.json({
      status: "success",
      message: "Tag creado exitosamente",
      data: {
        tag
      }
    });

  } catch (error) {
    if(error.code && error.code === 11000) {
      return res.status(400).json({
        status: "failed",
        message: "El tag ya fue creado",
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

// Controller para tomar una categoría específica
exports.getTag = async (req, res) => {
  try {
    const tag = await Tag.findOne({slug: req.params.slug});

    if(!tag) {
      return res.status(404).json({
        status: "failed",
        message: "Tag no encontrado"
      })
    }

    return res.json({
      status: "success",
      message: "Tag encontrado con éxito",
      data: {
        tag
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

// Controller para tomar todos los tags existentes
exports.getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find();

    return res.json({
      status: "success",
      message: "Se muestran todos los tags existentes",
      data: {
        tags
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

// Controller para eliminar un tag
exports.deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findOne({slug: req.params.slug});

    if(!tag) {
      return res.status(404).json({
        status: "failed",
        message: "Tag no encontrado"
      })
    }
    
    await Tag.findOneAndDelete({slug: req.params.slug});

    return res.json({
      status: "success",
      message: "Tag eliminado exitosamente"
    })

  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
      error: error
    })
  }
}