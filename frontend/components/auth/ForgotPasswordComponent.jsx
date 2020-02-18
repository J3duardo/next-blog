import {useState} from "react";
import {sendResetPasswordEmail} from "../../actions/auth";

const ForgotPasswordComponent = () => {
  const [state, setState] = useState({
    email: "",
    error: null,
    loading: false,
    message: null
  });

  const onChangeHandler = (e) => {
    setState({
      ...state,
      message: null,
      error: null,
      [e.target.name]: e.target.value
    })
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    setState({
      ...state,
      loading: true,
      error: null,
    });

    try {
      const response = await sendResetPasswordEmail(state.email);
      
      setState({
        password: "",
        message: response.data.message,
        error: null,
        loading: false
      });

    } catch (error) {
      if(error.response && error.response.data) {
        return setState({
          ...state,
          loading: false,
          error: error.response.data.message
        })
      };

      setState({
        ...state,
        loading: false,
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
      {state.error}
    </div>
    : null
  }

  const showMessage = () => {
  return state.message ?
    <div
      style={{position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", zIndex: 10}}
      className="alert alert-info"
    >
      {state.message}.
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
            disabled={state.loading}
            onChange={onChangeHandler}
            value={state.email}
          />
        </div>
        <div>
          <button
            className="btn btn-primary"
            disabled={state.loading}
          >
            {state.loading &&
              <span
                style={{marginRight: "5px"}}
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              />
            }
            Enviar
          </button>
        </div>
      </form>
    </React.Fragment>
  )
}

export default ForgotPasswordComponent;