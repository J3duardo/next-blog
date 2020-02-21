import {useState, useEffect} from "react";
import Router from "next/router";
import {withRouter} from "next/router/";
import dynamic from "next/dynamic";
import {getCookie, sessionExpiredHandler, isAuth} from "../../actions/auth";
import {getAllCategories} from "../../actions/category";
import {getAllTags} from "../../actions/tag";
import {getSingleBlog, updateBlog} from "../../actions/blog";
// import "../../node_modules/react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), {ssr: false});

const BlogEdit = (props) => {  
  const [state, setState] = useState({
    title: "",
    photo: "",
    categories: [],
    tags: [],
    token: getCookie("token")
  });
  
  const [body, setBody] = useState("");
  const [allCategories, setAllCategories] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Buscar el blog a editar al entrar a la página
  useEffect(() => {
    if(props.router.query.slug) {
      getBlogToEdit(props.router.query.slug)
    }
  }, [props.router]);

  // Cargar categorías y tags al cargar la página
  useEffect(() => {
    loadCategoriesAndTags()
  }, []);

  // Funcionalidad para buscar el blog que se va a editar
  const getBlogToEdit = async (slug) => {
    try {
      const res = await getSingleBlog(slug);
      const blogData = res.data.data;
      const loadedBlogCategories = blogData.categories.map(el => el._id);
      const loadedBlogTags = blogData.tags.map(el => el._id);

      // setBlog(blogData);
      setBody(blogData.body)
      setState({
        ...state,
        title: blogData.title,
        photo: blogData.photo,
        categories: loadedBlogCategories,
        tags: loadedBlogTags
      })

    } catch (error) {
      if(error.response) {
        return setError(error.response.data.message)
      }
      if(error.message.includes("Network")) {
        return setError("Error de conexión. Intente nuevamente")
      }

      return setError(error.message)
    }
  }

  // Funcionalidad para cargar las categorías y los tags
  const loadCategoriesAndTags = async () => {
    try {
      const categoriesData = await getAllCategories();
      const tagsData = await getAllTags();

      setAllCategories(categoriesData.data.data.categories);
      setAllTags(tagsData.data.data.tags);

    } catch (error) {
      if(error.message.toLowerCase().includes("network")) {
        return setError("Error al cargar los datos. Revise su conexión.");
      }

      return setError(error.message)
    }
  }

  // Contenido del blog
  const blogContentHandler = (e) => {
    setBody(e)
  }

  // Almacenar la data del post en el state
  const onChangeHandler = (e) => {
    setError(null);

    const categories = [...state.categories];
    const tags = [...state.tags];
    let value;

    if(e.target.name === "blogCategory") {
      if(e.target.checked) {
        setState({
          ...state,
          categories: [...state.categories, e.target.value]
        });
      } else {
        const filteredCategories = categories.filter(category => category !== e.target.value);
        setState({
          ...state,
          categories: filteredCategories
        });
      }
    }
    
    if(e.target.name === "blogTag") {
      if(e.target.checked) {
        setState({
          ...state,
          tags: [...state.tags, e.target.value]
        });
      } else {
        const filteredTags = tags.filter(tag => tag !== e.target.value);
        setState({
          ...state,
          tags: filteredTags
        });
      }
    }

    if(e.target.name === "photo") {
      value = e.target.files[0]
    } else {
      value = e.target.value
    }

    if(e.target.name !== "blogCategory" && e.target.name !== "blogTag") {
      setState({
        ...state,
        [e.target.name]: value
      })
    }
  }

  // Procesar la data del post editado y enviarla al backend
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    setError(null);
    setLoading(true);
    setSuccess(false);
    
    try {
      const formData = new FormData();
      formData.append("title", state.title);
      formData.append("body", body);
      formData.append("photo", state.photo);
      formData.append("categories", state.categories);
      formData.append("tags", state.tags);

      await updateBlog(formData, props.router.query.slug, state.token);

      setState({
        ...state,
        title: "",
        body: "",
        photo: ""
      });
      setBody("");
      setError(null);
      setLoading(false);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        Router.push("/blogs/[slug]", `/blogs/${props.router.query.slug}`);
      }, 1500);
      return;

    } catch (error) {
      if(error.response && error.response.data.message.includes("expirada")) {
        sessionExpiredHandler();
      }
      if(error.response) {
        setLoading(false);
        setSuccess(false);
        return setError(error.response.data.message);
      } else if(error.message.toLowerCase().includes("network")) {
        setLoading(false);
        setSuccess(false);
        return setError("Error de red. Revise su conexión a internet");
      } else{
        setLoading(false);
        setSuccess(false);
        return setError(error.message);
      }
    }
  }

  // Mostrar lista de categorías
  const renderCategories = () => {
    return allCategories.map(category => {
      return (
        <li key={category._id} className="list-unstyled">
          <input
            checked={state.categories.includes(category._id)}
            className="mr-2"
            type="checkbox"
            name="blogCategory"
            id={category.name}
            value={category._id}
            onChange={onChangeHandler}
          />
          <label htmlFor={category.name}>{category.name}</label>
        </li>
      )
    })
  }

  // Mostrar lista de tags
  const renderTags = () => {
    return allTags.map(tag => {
      return (
        <li key={tag._id} className="list-unstyled">
          <input
            checked={state.tags.includes(tag._id)}
            type="checkbox"
            className="mr-2"
            name="blogTag"
            id={tag.name}
            value={tag._id}
            onChange={onChangeHandler}
          />
          <label htmlFor={tag.name}>{tag.name}</label>
        </li>
      )
    })
  }

  const showLoading = () => {
    return loading ?
    <div
      style={{position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", zIndex: 10}}
      className="alert alert-info text-center"
    >
      Editando blog...
    </div>
    :
    null
  }

  const showError = () => {
    return error ?
    <div
      style={{position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", zIndex: 10}}
      className="alert alert-danger text-center"
    >
      {error}
    </div> : null
  }

  const showSuccessMessage = () => {
    return success ?
    <div
      style={{position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", zIndex: 10}}
      className="alert alert-info text-center"
    >
      Blog editado exitosamente
    </div>
    :
    null
  }

  return (
    <div className="container-fluid">
      {showLoading()}
      {showSuccessMessage()}
      {showError()}
      <div className="row">
        <div className="col-md-8">
          <form onSubmit={onSubmitHandler}>
          <div className="form-group">
              <h5>Título</h5>
              <input
                type="text"
                id="title"
                name="title"
                className="form-control"
                onChange={onChangeHandler}
                value={state.title}
              />
            </div>
            <div className="form-group">
            <h5>Contenido</h5>
              <ReactQuill
                value={body}
                placeholder="Escribe algo asombroso!!!"
                onChange={blogContentHandler}
                modules={BlogEdit.modules}
                formats={BlogEdit.formats}
              />
            </div>
            <div>
              <button className="btn btn-dark mr-2">Publicar</button>
              <button
                className="btn btn-action"
                onClick={() => Router.push(JSON.parse(isAuth()).role === 1 ? "/admin/create/blogs" : "/user/create/blogs")}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
        <div className="col-md-4">
          <div className="form-group pb-2">
            <h5>Imagen principal del post</h5>
            <label htmlFor="photoInput" className="btn btn-outline-info">Seleccionar imagen</label>
            <input
              type="file"
              name="photo"
              id="photoInput"
              accept="image/*"
              hidden
              onChange={onChangeHandler}
            />
            <br/>
            <React.Fragment>
              {state.photo ?
                <small className="text-muted">
                  Imagen: {state.photo.name.length > 15 ? state.photo.name.substring(0,18) + "..." : state.photo.name}
                </small>
                :
                <small className="text-muted">Debe ser menor de 1MB</small>                              
              }
            </React.Fragment>
            <hr style={{marginBottom: 0}}/>
            <h5>Categorías</h5>
            <ul style={{padding: 0, maxHeight: 200, overflowY: "scroll"}}>{renderCategories()}</ul>
            <hr/>
            <h5>Tags</h5>
            <ul style={{padding: 0, maxHeight: 200, overflowY: "scroll"}}>{renderTags()}</ul>
            <hr/>
          </div>
        </div>
      </div>
    </div>
  )
}

BlogEdit.modules = {
  toolbar: [
    [{header: [3, 4, 5, 6]}, {font: []}],
    [{size: []}],
    [{"align": []}, "bold", "italic", "underline", "strike", {"color": []}, {"background": []}, "blockquote"],
    [{ "script": "sub"}, { "script": "super" }],
    [{list: "ordered"}, {list: "bullet"}],
    ["link", "image", "video"],
    ["clean"],
    ["code-block"]
  ]
}

BlogEdit.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "align",
  "script",
  "color",
  "background",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "link",
  "image",
  "video",
  "code-block"
]

export default withRouter(BlogEdit);