const Blog = require("../models/blogModel");
const Category = require("../models/categoryModel");
const Tag = require("../models/tagModel");
const fs = require("fs");
const formidable = require("formidable");
const slugify = require("slugify");
const stripHtml = require("string-strip-html");

// Controller para crear posts
exports.createBlog = async (req, res) => {
  try {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
      if(err) {
        return res.status(400).json({
          status: "failed",
          message: "Ocurrió un error al enviar la imagen",
          error: "Ocurrió un error al enviar la imagen"
        })
      };
      try {
        const {title, body, categories, tags} = fields;

        // Validar título del post
        if(title === "") {
          return res.status(400).json({
            status: "failed",
            message: "Debe agregar el título del post",
            error: "Debe agregar el título del post"
          })
        }

        // Validar contenido del post
        if(body === "" || body.length < 200) {
          return res.status(400).json({
            status: "failed",
            message: "El contenido del post debe ser mayor de 200 caracteres",
            error: "El contenido del post debe ser mayor de 200 caracteres"
          })
        }

        // Validar categorías del post
        if(!categories || categories.length < 1) {
          return res.status(400).json({
            status: "failed",
            message: "Debe seleccionar al menos una categoría",
            error: "Debe seleccionar al menos una categoría"
          })
        }

        // Validar tags del post
        if(!tags || tags.length < 1) {
          return res.status(400).json({
            status: "failed",
            message: "Debe seleccionar al menos un tag",
            error: "Debe seleccionar al menos un tag"
          })
        }

        // Crear el excerpt el post
        let excerpt = null;
        if(stripHtml(body).length > 160) {
          excerpt = `${stripHtml(body.substring(0, 160))}...`
        } else {
          excerpt = stripHtml(body)
        }

        // Crear post
        const blog = new Blog();
        blog.title = title;
        blog.body = body;
        blog.slug = slugify(title).toLowerCase();
        blog.mtitle = `${process.env.APP_NAME} | ${title}`;
        blog.excerpt = excerpt;
        blog.mdescription = stripHtml(body.substring(0, 160));
        blog.postedBy = req.user.userId;
        blog.categories = categories.split(",");
        blog.tags = tags.split(",");
  
        // Aceptar sólo fotos que pesen menos de 1MB
        if(files.photo) {
          if(files.photo.size > 1000000) {
            return res.status(400).json({
              status: "failed",
              message: "El tamaño de la imagen debe ser menor de 1MB",
              error: "El tamaño de la imagen debe ser menor de 1MB"
            })
          };
          blog.photo.data = fs.readFileSync(files.photo.path);
          blog.photo.contentType = files.photo.type;
        };
  
        // Guardar post en la base de datos y enviar respuesta al cliente
        await blog.save();
        blog.photo = undefined;
        return res.json({
          status: "success",
          message: "Blog creado exitosamente",
          data: {
            blog
          }
        })
        
      } catch (error) {
        if(error.code && error.code === 11000) {
          if(Object.keys(error.keyValue).includes("slug") || Object.keys(error.keyValue).includes("title")) {
            return res.status(400).json({
              status: "failed",
              message: "El título ya fue utilizado en otro post",
              error: error
            })
          }
        }
                
        res.status(500).json({
          status: "failed",
          message: "internal server error",
          error: error
        })
      }

    })
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "internal server error",
      error: error
    })
  }
}

// Controller para tomar todos los blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog
      .find()
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id name username profile")
      .select("-photo -body -mtitle -mdescription");
    return res.json({
      status: "success",
      message: "se muestran todos los blogs diponibles",
      data: {blogs}
    })
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "internal server error",
      error: error
    })
  }
}

// Controller para tomar un blog específico
exports.getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({slug: req.params.slug})
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id name username profile")
      .select("-excerpt")

    if(!blog) {
      return res.status(404).json({
        status: "failed",
        message: "Blog no encontrado",
        error: "Blog no encontrado"
      })
    }

    return res.json({
      status: "success",
      message: "Blog encontrado",
      data: blog
    })

  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "internal server error",
      error: error
    })
  }
}

// Controller para tomar las categorías y los tags
exports.getCategoriesAndTags = async (req, res) => {
  try {
    const limit = req.body.limit ? req.body.limit * 1 : 10;
    const skip = req.body.skip ? req.body.skip * 1 : 0;
    const blogs = await Blog
      .find()
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id name username profile")
      .sort({createdAt: -1})
      .skip(skip)
      .limit(limit)
      .select("-photo -body -mtitle -mdescription");
    const categories = await Category.find();
    const tags = await Tag.find();

    res.json({
      status: "success",
      data:{
        blogs,
        categories,
        tags,
        results: blogs.length
      }
    })

  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "internal server error",
      error: error
    })
  }
}

// Controller para eliminar un blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({slug: req.params.slug});

    if(!blog) {
      return res.status(404).json({
        message: "failed",
        message: "Blog no encontrado",
        error: "Blog no encontrado"
      })
    }

    return res.json({
      status: "success",
      message: `Blog ${blog.title} eliminado correctamente`,
      data: `Blog ${blog.title} eliminado correctamente`
    })

  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "internal server error",
      error: error
    })
  }
}

// Controller para editar un blog
exports.updateBlog = async (req, res) => {

}