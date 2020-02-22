import {useState} from "react";
import Link from "next/link";
import {signin, authenticateUser, isAuth} from "../../actions/auth";
import Router from "next/router";
import GoogleLoginComponent from "./GoogleLoginComponent";

const LoginComponent = (props) => {
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
      
      setState({
        email: "",
        password: "",
        message: response.data.message,
        error: null,
        loading: false,
        showForm: false
      });

      authenticateUser(response.data.data, () => setTimeout(() => {
        if(isAuth() && JSON.parse(isAuth()).role === 1) {
          Router.push("/admin")
        } else {
          Router.push("/user")
        }
      }, 1500))

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

  const showError = () => {
  return state.error ?
    <div
      style={{position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", zIndex: 10}}
      className="alert alert-danger text-center px-4 py-3"
    >
      <button
        style={{position: "absolute", top: 0, right: "5px"}}
        type="button"
        class="close"
        onClick={() => setState({...state, error: null})}
        aria-label="Close"
      >
        <span style={{lineHeight: 0}} aria-hidden="true">&times;</span>
      </button>
      {state.error.error || state.error}
    </div>
    : null
  }

  const showMessage = () => {
  return state.message ?
    <div
      style={{position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", zIndex: 10}}
      className="alert alert-info text-center"
    >
      <button
        style={{position: "absolute", top: 0, right: "5px"}}
        type="button"
        class="close"
        onClick={() => setState({...state, message: null})}
        aria-label="Close"
      >
        <span style={{lineHeight: 0}} aria-hidden="true">&times;</span>
      </button>
      {state.message}. Redirigiendo...
    </div>
    : null
  }

  return (
    <React.Fragment>
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
        <div
          style={{display: "flex", justifyContent: "center"}} className="mb-2"
        >
          <button
            className="btn btn-action mr-2"
            disabled={state.loading || !state.showForm}
          >
            Iniciar sesión
          </button>
          <GoogleLoginComponent />
        </div>
      </form>
      <div className="text-center" style={{width: "100%"}}>
        <small>¿Olvidó su contraseña?
          <Link href="/forgot-password">
            <a>{" "}Restablecer contraseña</a>
          </Link>
        </small>
      </div>
      <div className="text-center" style={{width: "100%"}}>
        <small>¿No posee cuenta en NextBlog?
          <Link href="/signup">
            <a>{" "}Registrarse</a>
          </Link>
        </small>
      </div>
    </React.Fragment>
  )
}

export default LoginComponent;