import {useState, useEffect} from "react";
import Link from "next/link";
import Router from "next/router";
import {getCookie} from "../../actions/auth";
import {createTag, getAllTags, deleteTag} from "../../actions/tag";

const Tag = () => {
  const [state, setState] = useState({
    tagName: "",
    tags: [],
    token: getCookie("token"),
    success: false,
    successMessage: "",
    error: null,
    loading: false,
    loadingCreation: false,
    loadingDeletion: false,
    removed: false
  });

  // Funcionalidad para tomar todas las categorías
  const getTags = async () => {
    setState({
      ...state,
      loading: true,
      error: null
    });

    try {
      const response = await getAllTags();        
      setState({
        ...state,
        tagName: "",
        tags: response.data.data.tags,
        loading: false,
        error: null
      })
    } catch (error) {
      return setState({
        ...state,
        loading: false,
        success: false,
        error: error.message
      })
    }
  }

  // Funcionalidad para eliminar categoría
  const deleteTagHandler = async (slug, token) => {
    setState({
      ...state,
      loadingDeletion: true,
      error: null
    });

    try {
      const res = await deleteTag(slug, token);   

      setState({
        ...state,
        name: "",
        loadingDeletion: false,
        success: true,
        successMessage: res.data.message,
        error: null
      });

      // Tomar las categorías actualizadas
      setTimeout(async () => {
        await getTags();
      }, 1500);
      
    } catch (error) {
      if(error.response) {
        return setState({
          ...state,
          loadingDeletion: false,
          success: false,
          error: error.response.data.message
        })
      } else {
        return setState({
          ...state,
          loadingDeletion: false,
          success: false,
          error: error.message
        })
      }
    }
  }

  // Tomar todas las categorías al montar el componente
  useEffect(() => {
    getTags();
  }, []);

  const onChangeHandler = (e) => {
    setState({
      ...state,
      error: null,
      [e.target.name]: e.target.value
    })
  }

  // Agregar la nueva categoría
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    setState({
      ...state,
      loadingCreation: true,
      error: null
    });

    try {
      const res = await createTag(state.tagName, state.token);
      setState({
        ...state,
        tagName: "",
        loadingCreation: false,
        success: true,
        successMessage: res.data.message,
        error: null
      });

      // Tomar las categorías actualizadas
      setTimeout(async () => {
        await getTags();
      }, 1500);

    } catch (error) {
      if(error.response) {
        return setState({
          ...state,
          loadingCreation: false,
          success: false,
          error: error.response.data.message
        })
      } else {
        return setState({
          ...state,
          loadingCreation: false,
          success: false,
          error: error.message
        })
      }
    }
  }

  // Mostrar las categorías en pantalla
  const renderTags = () => {
    return state.tags.map((tag, i) => {
      return (
        <button
          title="Doble click para eliminar el tag"
          key={tag._id}
          id={`category-${tag._id}`}
          onDoubleClick={() => deleteTagHandler(tag.slug, state.token)}
          className="btn btn-outline-primary mr-1 ml-1"
        >
          {tag.name}
        </button>
      )
    })
  }
  
  const showLoading = () => {
    return (
      state.loading ? <div className="alert alert-info">Cargando tags...</div>
      :
      state.loadingCreation ? <div className="alert alert-info">Creando tag...</div>
      :
      state.loadingDeletion ? <div className="alert alert-info">Eliminando tag...</div>
      :
      null
    );
  }

  const showError = () => {
  return state.error ? <div className="alert alert-danger">{state.error}</div> : null
  }

  const showSuccessMessage = () => {
  return state.success ? <div className="alert alert-info">{state.successMessage}</div> : null
  }

  return (
    <React.Fragment>
      {showLoading()}
      {showError()}
      {showSuccessMessage()}
      <form className="mb-3" onSubmit={onSubmitHandler}>
        <div className="form-group">
          <label htmlFor="tagName" className="text-muted">Nombre</label>
          <input
            type="text"
            name="tagName"
            id="tagName"
            autoComplete="off"
            className="form-control"
            onChange={onChangeHandler}
            value={state.tagName}
          />
        </div>
        <button type="submit" className="btn btn-primary">Crear tag</button>
      </form>
      <p className="text-muted mb-3"><small>Doble click en un tag para eliminarlo</small></p>
      <div>{renderTags()}</div>
    </React.Fragment>
  )
}

export default Tag;
