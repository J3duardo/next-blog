import {useState} from "react";
import {withRouter} from "next/router";
import Head from "next/head";
import {contactAdmin, contactAuthor} from "../../actions/contactForm";

const APP_NAME = process.env.APP_NAME;

const ContactForm = (props) => {
  const [state, setState] = useState({
    name: "",
    email: "",
    message: "",
    sent: false,
    loading: false,
    success: false,
    successMessage: null,
    error: null
  });

  // Enviar el correo
  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      setState({
        ...state,
        error: null,
        successMessage: null,
        loading: true
      });

      const mailData = {
        name: state.name,
        email: state.email,
        message: state.message
      }

      // Enviar el mensaje al administrador
      if(props.router.pathname === "/contact") {
        await contactAdmin(mailData)
        setState({
          ...state,
          name: "",
          email: "",
          message: "",
          successMessage: "Mensaje enviado exitosamente",
          error: null,
          loading: false,
          sent: true,
          success: true
        });

        // Enviar el mensaje al autor del post
      } else if(props.router.pathname.includes("profile")) {
        mailData["authorEmail"] = props.authorEmail;
        await contactAuthor(mailData);
        setState({
          ...state,
          name: "",
          email: "",
          message: "",
          successMessage: "Mensaje enviado exitosamente",
          error: null,
          loading: false,
          sent: true,
          success: true
        });
      }
      
    } catch (error) {
      console.log({...error});

      if(error.response) {
        return setState({
          ...state,
          successMessage: null,
          loading: false,
          success: false,
          sent: false,
          error: error.response.data.message
        })
      }

      return setState({
        ...state,
        successMessage: null,
        loading: false,
        success: false,
        sent: false,
        error: error.message
      })
    }
  };

  const onChangeHandler = (e) => {
    setState({
      ...state,
      successMessage: null,
      error: null,
      success: false,
      [e.target.name]: e.target.value
    })
  };

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
        {state.error}.
      </div>
      : null
    }
  
  const showMessage = () => {
    return state.successMessage ?
    <div
      style={{position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", zIndex: 10}}
      className="alert alert-info"
    >
      <button
        style={{position: "absolute", top: 0, right: "5px"}}
        type="button"
        class="close"
        onClick={() => setState({...state, successMessage: null})}
        aria-label="Close"
      >
        <span style={{lineHeight: 0}} aria-hidden="true">&times;</span>
      </button>
      {state.successMessage}.
    </div>
    : null
  }

  // Title de la página
  const head = () => {
    return (
      <Head>
        <title>Contactar | {APP_NAME}</title>
      </Head>
    )
  }

  return (
    <React.Fragment>
      {showMessage()}
      {showError()}
      {head()}
      <form onSubmit={onSubmitHandler}>
        <div className="form-group">
          <div className="form-group">
            <label htmlFor="name" className="lead">Nombre</label>
            <input
              name="name"
              id="name"
              type="text"
              className={`form-control ${state.error && state.error.toLowerCase().includes("nombre") && "input-error"}`}
              onChange={onChangeHandler}
              value={state.name}
              placeholder="Introduzca su nombre"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="lead">Email</label>
            <input
              name="email"
              id="email"
              type="email"
              className={`form-control ${state.error && state.error.toLowerCase().includes("email") && "input-error"}`}
              onChange={onChangeHandler}
              value={state.email}
              placeholder="Introduzca un email válido"
            />
          </div>
          <label htmlFor="message" className="lead">Mensaje</label>
          <textarea
            name="message"
            id="message"
            cols="30"
            rows="10"
            className={`form-control ${state.error && state.error.toLowerCase().includes("mensaje") && "input-error"}`}
            onChange={onChangeHandler}
            value={state.message}
            placeholder="El mensaje debe contener al menos 20 caracteres"
          />
        </div>
        <div>
          <button
            type="submit"
            className="btn btn-action"
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

export default withRouter(ContactForm);