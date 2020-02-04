import {useState} from "react";
import {signin, authenticateUser} from "../../actions/auth";
import Router from "next/router";

const LoginComponent = () => {
  const [state, setState] = useState({
    email: "",
    password: "",
    error: null,
    loading: false,
    message: null,
    showForm: true
  });

  const onChangeHandler = (e) => {
    setState({
      ...state,
      error: null,
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
      const userData = {
        email: state.email,
        password: state.password
      }
      const response = await signin(userData);
      console.log(response.data);
      
      setState({
        email: "",
        password: "",
        message: response.data.message,
        error: null,
        loading: false,
        showForm: false
      });

      authenticateUser(response.data.data, () => setTimeout(() => {Router.push("/")}, 2000))

    } catch (error) {
      if(error.response && error.response.data) {
        return setState({
          ...state,
          loading: false,
          showForm: true,
          error: {...error.response.data}
        })
      };
      
      setState({
        ...state,
        loading: false,
        showForm: true,
        error: error.message
      })
    }
  }

  const showLoading = () => {
    return state.loading ? <div className="alert alert-info">Cargando...</div> : null;
  }

  const showError = () => {
  return state.error ? <div className="alert alert-danger">{state.error.error || state.error}</div> : null
  }

  const showMessage = () => {
  return state.message ? <div className="alert alert-info">{state.message}. Redirigiendo...</div> : null
  }

  return (
    <React.Fragment>
      {showLoading()}
      {showMessage()}
      {showError()}
      <form onSubmit={onSubmitHandler}>
        <div className="form-group">
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Email"
            disabled={state.loading || !state.showForm}
            onChange={onChangeHandler}
            value={state.email}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Contraseña"
            disabled={state.loading || !state.showForm}
            onChange={onChangeHandler}
            value={state.password}
          />
        </div>
        <div>
          <button
            className="btn btn-primary"
            disabled={state.loading || !state.showForm}
          >
            Iniciar sesión
          </button>
        </div>
      </form>
    </React.Fragment>
  )
}

export default LoginComponent;