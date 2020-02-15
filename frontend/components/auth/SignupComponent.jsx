import {useState} from "react";
import {signup} from "../../actions/auth";

const SignupComponent = () => {
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
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
        name: state.name,
        email: state.email,
        password: state.password,
        passwordConfirm: state.passwordConfirm
      }
      const response = await signup(userData);
      console.log(response.data);
      setState({
        name: "",
        email: "",
        password: "",
        passwordConfirm: "",
        message: response.data.message,
        error: null,
        loading: false,
        showForm: false
      });
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
      className="alert alert-danger"
    >
      {state.error.error || state.error}
    </div>
    : null
  }

  const showMessage = () => {
  return state.message ?
    <div
      style={{position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", zIndex: 10}}
      className="alert alert-info"
    >
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
            type="text"
            name="name"
            className="form-control"
            placeholder="Nombre"
            disabled={state.loading || !state.showForm}
            onChange={onChangeHandler}
            value={state.name}
          />
        </div>
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
        <div className="form-group">
          <input
            type="password"
            name="passwordConfirm"
            className="form-control"
            disabled={state.loading || !state.showForm}
            placeholder="Confirmar contraseña"
            onChange={onChangeHandler}
            value={state.passwordConfirm}
          />
        </div>
        <div>
          <button
            className="btn btn-primary"
            disabled={state.loading || !state.showForm}
          >
            Registrarse
          </button>
        </div>
      </form>
    </React.Fragment>
  );
}

export default SignupComponent;
