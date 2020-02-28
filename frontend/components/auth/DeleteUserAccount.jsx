import {useState} from "react";
import Router from "next/router";
import {getCookie, deleteUserAccount, signout} from "../../actions/auth";

const SignupComponent = () => {
  const [state, setState] = useState({
    password: "",
    passwordConfirm: "",
    error: null,
    loading: false,
    message: null
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
      error: null,
      loading: true
    });
    try {
      const data = {
        password: state.password,
        passwordConfirm: state.passwordConfirm,
        token: getCookie("token")
      }

      const res = await deleteUserAccount(data);
      signout();
      Router.push("/");

      setState({
        ...state,
        loading: false,
        message: res.data.message
      });

    } catch (error) {
      if(error.response && error.response.data) {
        return setState({
          ...state,
          loading: false,
          showForm: true,
          error: error.response.data.message
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
      className="alert alert-danger"
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
      {state.error}
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
      {state.message}
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
            Eliminar cuenta
          </button>
        </div>
      </form>
    </React.Fragment>
  );
}

export default SignupComponent;
