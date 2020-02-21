import {useState} from "react";
import Link from "next/link";
import {resetPassword} from "../../actions/auth";

const ResetPasswordComponent = (props) => {
  const [state, setState] = useState({
    password: "",
    passwordConfirm: "",
    error: null,
    loading: false,
    message: null,
    success: false
  });

  const onChangeHandler = (e) => {
    setState({
      ...state,
      error: null,
      message: null,
      success: false,
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
        token: props.token,
        password: state.password,
        passwordConfirm: state.passwordConfirm
      }

      const response = await resetPassword(userData);

      setState({
        password: "",
        passwordConfirm: "",
        message: response.data.message,
        error: null,
        loading: false,
        success: true
      });
    } catch (error) {
      if(error.response) {
        return setState({
          ...state,
          loading: false,
          success: false,
          error: error.response.data.message
        })
      };

      if(error.message.includes("expired")) {
        return setState({
          ...state,
          loading: false,
          success: false,
          error: "Token expirado. Envíe un nuevo email de restablecimiento de contraseña."
        })
      }
      
      setState({
        ...state,
        loading: false,
        success: false,
        error: error.message
      })
    }
  }

  const showError = () => {
  return state.error ?
    <div
      style={{position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", zIndex: 10}}
      className="alert alert-danger text-center"
    >
      {state.error}
      <div style={{width: "100%", height: "100%"}}>
        <p
          onClick={() => setState({...state, error: null})}
          className="font-weight-bold"
          style={{
            position: "absolute",
            top: "-2px",
            right: "0",
            padding: "5px",
            lineHeight: 1,
            cursor: "pointer"
          }}
        >
          x
        </p>
      </div>
    </div>
    : null
  }

  const showMessage = () => {
  return state.message && state.success ?
    <div
      style={{position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", zIndex: 10}}
      className="alert alert-info text-center"
    >
      {state.message}.
      <p>Inicie sesión con su nueva contraseña.</p>
      <p><Link href="/login"><a>Iniciar sesión</a></Link></p>
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
            type="password"
            name="password"
            className="form-control"
            placeholder="Contraseña"
            disabled={state.loading}
            onChange={onChangeHandler}
            value={state.password}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="passwordConfirm"
            className="form-control"
            disabled={state.loading}
            placeholder="Confirmar contraseña"
            onChange={onChangeHandler}
            value={state.passwordConfirm}
          />
        </div>
        <div>
          <button
            className="btn btn-action"
            disabled={state.loading}
          >
            Actualizar contraseña
          </button>
        </div>
      </form>
    </React.Fragment>
  );
}

ResetPasswordComponent.getInitialProps = ({query}) => {
  return {
    token: query.token
  }
}

export default ResetPasswordComponent;
