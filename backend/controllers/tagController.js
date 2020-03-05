const Tag = require("../models/tagModel");
const Blog = require("../models/blogModel");
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
      message: `Categoría ${name} agregado exitosamente`,
      data: {
        tag
      }
    });

  } catch (error) {
    if(error.code && error.code === 11000) {
      return res.status(400).json({
        status: "failed",
        message: "Este tag ya existe",
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

    // Chequear si el tag existe
    if(!tag) {
      return res.status(404).json({
        status: "failed",
        message: "Tag no encontrado"
      })
    }

    // Si existe, buscar los blogs relacionados con ese tag
    const blogs = await Blog.find({tags: tag})
    .populate("categories", "_id name slug")
    .populate("tags", "_id name slug")
    .populate("postedBy", "_id name")
    .select("_id title mainPhoto slug excerpt categories postedBy tags createdAt updatedAt")

    return res.json({
      status: "success",
      message: "",
      data: {tag, blogs}
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
    
    // Eliminar el tag de la colección de tags
    await Tag.findOneAndDelete({slug: req.params.slug});

    // Eliminar el tag de los blogs que contengan el tag eliminado
    await Blog.updateMany({$pull: {tags: tag._id}});

    return res.json({
      status: "success",
      message: `Categoría ${tag.name} eliminada`
    })

  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
      error: error
    })
  }
}