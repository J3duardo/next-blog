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
        if(title === "" || title.length < 3) {
          return res.status(400).json({
            status: "failed",
            message: "El título del post debe contener al menos 3 caracteres",
            error: "El título del post debe contener al menos 3 caracteres"
          })
        }

        if(title.length > 160) {
          return res.status(400).json({
            status: "failed",
            message: "El título del post debe contener máximo 160 caracteres",
            error: "El título del post debe contener máximo 160 caracteres"
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
        if(stripHtml(body).length > 350) {
          excerpt = `${body.substring(0, 350)}...`
        } else {
          excerpt = body
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
      .select("-excerpt", "-photo")

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
  try {
    const updatedBlog = await Blog.findOne({slug: req.params.slug});

    if(!updatedBlog) {
      return res.status(404).json({
        status: "failed",
        message: "Blog no encontrado",
        error: "Blog no encontrado"
      })
    }

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
        // Conservar el slug aunque el título del post sea modificado.
        // Esto es para evitar que se modifique la url original del post luego de que la misma haya sido indexada por google
        let oldSlug = updatedBlog.slug;

        // Extraer data actualizada del post
        const {title, body, categories, tags} = fields;

        // Validar título del post
        if(title === "" || title.length < 3) {
          return res.status(400).json({
            status: "failed",
            message: "El título del post debe contener al menos 3 caracteres",
            error: "El título del post debe contener al menos 3 caracteres"
          })
        }

        if(title.length > 160) {
          return res.status(400).json({
            status: "failed",
            message: "El título del post debe contener máximo 160 caracteres",
            error: "El título del post debe contener máximo 160 caracteres"
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
        if(stripHtml(body).length > 350) {
          excerpt = `${body.substring(0, 350)}...`
        } else {
          excerpt = body
        }

        // Actualizar la data del post a editar
        updatedBlog.title = title;
        updatedBlog.body = body;
        updatedBlog.slug = oldSlug;
        updatedBlog.excerpt = excerpt;
        updatedBlog.mtitle = `${process.env.APP_NAME} | ${title}`;
        updatedBlog.mdescription = stripHtml(body.substring(0, 160));
        updatedBlog.postedBy = req.user.userId;
        updatedBlog.categories = categories.split(",");
        updatedBlog.tags = tags.split(",");
  
        // Aceptar sólo fotos que pesen menos de 1MB
        if(files.photo) {
          if(files.photo.size > 1000000) {
            return res.status(400).json({
              status: "failed",
              message: "El tamaño de la imagen debe ser menor de 1MB",
              error: "El tamaño de la imagen debe ser menor de 1MB"
            })
          };
          updatedBlog.photo.data = fs.readFileSync(files.photo.path);
          updatedBlog.photo.contentType = files.photo.type;
        };
  
        // Guardar post actualizado en la base de datos y enviar respuesta al cliente
        await updatedBlog.save();
        updatedBlog.photo = undefined;
        return res.json({
          status: "success",
          message: "Blog actualizado exitosamente",
          data: {
            updatedBlog
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

// Controller para tomar la foto de un blog específico
exports.getBlogPhoto = async (req, res) => {
  try {
    const blog = await Blog.findOne({slug: req.params.slug}).select("photo");

    if(!blog) {
      return res.status(404).json({
        status: "failed",
        message: "Blog no encontrado",
        error: "Blog no encontrado"
      })
    }

    res.set("Content-Type", blog.photo.contentType);
    return res.send(blog.photo.data)

  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "internal server error",
      error: error
    })
  }
}