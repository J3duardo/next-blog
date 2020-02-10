import {useState, useEffect} from "react";
import Link from "next/link";
import Router from "next/router";
import {withRouter} from "next/router/";
import dynamic from "next/dynamic";
import {getCookie, isAuth} from "../../actions/auth";
import {getAllCategories} from "../../actions/category";
import {getAllTags} from "../../actions/tag";
import {createBlog} from "../../actions/blog";
const ReactQuill = dynamic(() => import("react-quill"), {ssr: false});
import "../../node_modules/react-quill/dist/quill.snow.css";

const BlogCreate = (props) => {
  const {router} = props;

  const [state, setState] = useState({
    title: "",
    body: "",
    photo: "",
    categories: [],
    tags: [],
    token: getCookie("token"),
    error: null,
    sizeError: null
  });

  const [blogCategories, setBlogCategories] = useState([]);
  const [blogTags, setBlogTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Funcionalidad para cargar las categorías y los tags
  const loadCategoriesAndTags = async () => {
    try {
      const categoriesData = await getAllCategories();
      const tagsData = await getAllTags();

      setState({
        ...state,
        categories: categoriesData.data.data.categories,
        tags: tagsData.data.data.tags
      })

    } catch (error) {
      if(error.message.toLowerCase().includes("network")) {
        return setState({
          ...state,
          error: "Error al cargar los datos. Revise su conexión."
        })
      }

      return setState({
        ...state,
        error: error.message
      })
    }
  }

  useEffect(() => {
    // Cargar categorías y tags al cargar la página
    loadCategoriesAndTags()

    // Guardar el contenido del post en el localStorage (ejecutar sólo en el lado del cliente)
    if(typeof window !== "undefined" && localStorage.getItem("blog")) {
      setState({
        ...state,
        body: JSON.parse(localStorage.getItem("blog"))
      })
    }
  }, [])

  // Procesar la data del post y enviarla al backend
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    setState({
      ...state,
      sizeError: null
    });

    setLoading(true);
    setSuccess(false);
    
    try {
      const formData = new FormData();
      formData.append("title", state.title);
      formData.append("body", state.body);
      formData.append("photo", state.photo);
      formData.append("categories", blogCategories);
      formData.append("tags", blogTags);

      await createBlog(formData, state.token);

      localStorage.removeItem("blog");

      setState({
        ...state,
        title: "",
        body: "",
        photo: "",
        error: null,
        sizeError: null
      });
      setLoading(false);
      setSuccess(true);

      setTimeout(() => {setSuccess(false)}, 1500)

      return;

    } catch (error) {
      if(error.response) {
        if(error.response.data.message.includes("imagen")) {
          setLoading(false);
          setSuccess(false);
          return setState({
            ...state,
            error: null,
            sizeError: error.response.data.message
          })
        } else {
          setLoading(false);
          setSuccess(false);
          return setState({
            ...state,
            sizeError: null,
            error: error.response.data.message
          })
        }
      } else if(error.message.toLowerCase().includes("network")) {
        setLoading(false);
        setSuccess(false);
        return setState({
          ...state,
          sizeError: null,
          error: "Error de red. Revise su conexión a internet"
        })
      } else{
        setLoading(false);
        setSuccess(false);
        return setState({
          ...state,
          sizeError: null,
          error: error.message
        })
      }
    }
  }

  // Almacenar la data del post en el state
  const onChangeHandler = (e) => {
    const categories = [...blogCategories];
    const tags = [...blogTags];
    let value;

    if(e.target.name === "blogCategory") {
      if(e.target.checked) {
        setBlogCategories([...categories, e.target.value]);
      } else {
        const filteredCategories = categories.filter(category => category !== e.target.value);
        setBlogCategories(filteredCategories);
      }
    }
    
    if(e.target.name === "blogTag") {
      if(e.target.checked) {
        setBlogTags([...tags, e.target.value]);
      } else {
        const filteredTags = tags.filter(tag => tag !== e.target.value);
        setBlogTags(filteredTags);
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
        [e.target.name]: value,
        error: null,
        sizeError: null
      })
    }
  }

  const blogContentHandler = (e) => {
    setState({
      ...state,
      body: e
    });

    if(typeof window !== "undefined") {
      localStorage.setItem("blog", JSON.stringify(e))
    }
  }

  // Mostrar lista de categorías
  const renderCategories = () => {
    return state.categories.map(category => {
      return (
        <li key={category._id} className="list-unstyled">
          <input
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
    return state.tags.map(tag => {
      return (
        <li key={tag._id} className="list-unstyled">
          <input
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
    return (
      loading ? <div className="alert alert-info text-center">Creando post...</div>
      :
      null
    );
  }

  const showError = () => {
  return state.error || state.sizeError ? <div className="alert alert-danger text-center">{state.error || state.sizeError}</div> : null
  }

  const showSuccessMessage = () => {
  return success ?
    <div className="alert alert-info text-center">
      Post creado exitosamente
    </div>
    :
    null
  }

  return (
    <div className="container-fluid">
      {showLoading()}
      {showError()}
      {showSuccessMessage()}
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
                value={state.body}
                placeholder="Escribe algo asombroso!!!"
                onChange={blogContentHandler}
                modules={BlogCreate.modules}
                formats={BlogCreate.formats}
              />
            </div>
            <div>
              <button className="btn btn-primary">Publicar</button>
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
          </div>
          <h5>Categorías</h5>
          <ul style={{padding: 0, maxHeight: 200, overflowY: "scroll"}}>{renderCategories()}</ul>
          <hr/>
          <h5>Tags</h5>
          <ul style={{padding: 0, maxHeight: 200, overflowY: "scroll"}}>{renderTags()}</ul>
          <hr/>
        </div>
      </div>
    </div>
  );
}

BlogCreate.modules = {
  toolbar: [
    [{header: [3, 4, 5, 6]}, {font: []}],
    [{size: []}],
    [{"align": []}, "bold", "italic", "underline", "strike", {"color": []}, {"background": []}, "blockquote"],
    [{ "script": "sub"}, { "script": "super" }],
    [{list: "ordered"}, {list: "bullet"}],
    ["link", "video"],
    ["clean"],
    ["code-block"]
  ]
}

BlogCreate.formats = [
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

export default withRouter(BlogCreate);
