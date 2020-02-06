import {useState} from "react";
import Link from "next/link";
import Router from "next/router";
import {isAuth, getCookie} from "../../actions/auth";
import {createCategory} from "../../actions/category";

const Category = () => {
  const [state, setState] = useState({
    name: "",
    categories: [],
    token: getCookie("token"),
    success: false,
    error: null,
    loading: false,
    removed: false
  });

  const onChangeHandler = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    })
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    setState({
      ...state,
      loading: true
    });

    try {
      const response = await createCategory(state.name, state.token);
      console.log(response)
    } catch (error) {
      if(error.response) {
        return setState({
          ...state,
          loading: false,
          success: false,
          error: error.response.data.message
        })
      } else {
        return setState({
          ...state,
          loading: false,
          success: false,
          error: error.message
        })
      }
    }
  }
  
  const showLoading = () => {
    return state.loading ? <div className="alert alert-info">Creando categoría...</div> : null;
  }

  const showError = () => {
  return state.error ? <div className="alert alert-danger">{state.error}</div> : null
  }

  const showSuccessMessage = () => {
  return state.success ? <div className="alert alert-info">caregoría agregada con éxito</div> : null
  }

  return (
    <React.Fragment>
      {showLoading()}
      {showError()}
      {showSuccessMessage()}
      <form onSubmit={onSubmitHandler}>
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
    </React.Fragment>
  )
}

export default Category;
