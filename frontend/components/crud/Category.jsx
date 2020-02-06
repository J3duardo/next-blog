import {useState, useEffect} from "react";
import { Tooltip } from "reactstrap";
import Link from "next/link";
import Router from "next/router";
import {isAuth, getCookie} from "../../actions/auth";
import {createCategory, getAllCategories, getCategory, deleteCategory} from "../../actions/category";

const Category = () => {
  const [state, setState] = useState({
    name: "",
    categories: [],
    token: getCookie("token"),
    success: false,
    successMessage: "",
    error: null,
    loading: false,
    loadingCreation: false,
    loadingDeletion: false,
    removed: false
  });

  // Mostrar/ocultar tooltip
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggleTooltip = () => setTooltipOpen(!tooltipOpen);

  // Funcionalidad para tomar todas las categorías
  const getCategories = async () => {
    setState({
      ...state,
      loading: true,
      error: null
    });

    try {
      const response = await getAllCategories();        
      setState({
        ...state,
        categories: response.data.data.categories,
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
  const deleteCategoryHandler = async (slug, token) => {
    setState({
      ...state,
      loadingDeletion: true,
      error: null
    });

    try {
      const res = await deleteCategory(slug, token);   

      setState({
        ...state,
        loadingDeletion: false,
        success: true,
        successMessage: res.data.message,
        error: null
      });

      // Tomar las categorías actualizadas
      setTimeout(async () => {
        await getCategories();
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
    getCategories();
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
      const res = await createCategory(state.name, state.token);
      setState({
        ...state,
        name: "",
        loadingCreation: false,
        success: true,
        successMessage: res.data.message,
        error: null
      });

      // Tomar las categorías actualizadas
      setTimeout(async () => {
        await getCategories();
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
  const renderCategories = () => {
    return state.categories.map((category, i) => {
      return (
        <button
          title="Doble click para eliminar categoría"
          key={category._id}
          id={`category-${category._id}`}
          onDoubleClick={() => deleteCategoryHandler(category.slug, state.token)}
          className="btn btn-outline-primary mr-1 ml-1"
        >
          {category.name}
        </button>
      )
    })
  }
  
  const showLoading = () => {
    return (
      state.loading ? <div className="alert alert-info">Cargando categorías...</div>
      :
      state.loadingCreation ? <div className="alert alert-info">Creando categoría...</div>
      :
      state.loadingDeletion ? <div className="alert alert-info">Eliminando categoría...</div>
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
          <label htmlFor="name" className="text-muted">Nombre</label>
          <input
            type="text"
            name="name"
            id="name"
            autoComplete="off"
            className="form-control"
            onChange={onChangeHandler}
            value={state.name}
          />
        </div>
        <button type="submit" className="btn btn-primary">Crear categoría</button>
      </form>
      <div>{renderCategories()}</div>
    </React.Fragment>
  )
}

export default Category;
