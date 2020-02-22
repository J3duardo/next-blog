import {useState, useEffect} from "react";
import Link from "next/link";
import Router from "next/router";
import GoogleLogin from "react-google-login";
import {googleLogin, authenticateUser, isAuth} from "../../actions/auth";

const GoogleLoginComponent = (props) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [googleClientId, setGoogleClientId] = useState(process.env.GOOGLE_CLIENT_ID);

  useEffect(() => {
    setGoogleClientId(process.env.GOOGLE_CLIENT_ID);
  })

  const responseGoogle = async (res) => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const tokenId = res.tokenId;
      const loginResponse = await googleLogin(tokenId);
      const token = loginResponse.data.data.token;
      const user = loginResponse.data.data.user;

      setLoading(false);
      setMessage(loginResponse.data.message)
      
      // Autenticar el usuario en el cliente
      authenticateUser({token, user}, () => setTimeout(() => {
        if(isAuth() && JSON.parse(isAuth()).role === 1) {
          Router.push("/admin")
        } else {
          Router.push("/user")
        }
      }, 1500));

    } catch (error) {
      setLoading(false);
      setMessage(null);

      if(error.response) {
        return setError(error.response.data.message)
      }

      if(error.message.includes("Network") || error.message.includes("ECONNREFUSED")) {
        return setError("Error de conexión. Intente nuevamente.")
      }

      setError(error.message);
    }
  }

  const showError = () => {
    return error ?
      <div
        style={{position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", zIndex: 10}}
        className="alert alert-danger text-center"
      >
        <button
          style={{position: "absolute", top: 0, right: "5px"}}
          type="button"
          class="close"
          onClick={() => setError(null)}
          aria-label="Close"
        >
          <span style={{lineHeight: 0}} aria-hidden="true">&times;</span>
        </button>
        {error}
      </div>
      : null
    }
  
    const showMessage = () => {
    return message ?
      <div
        style={{position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", zIndex: 10}}
        className="alert alert-info text-center"
      >
        <button
          style={{position: "absolute", top: 0, right: "5px"}}
          type="button"
          class="close"
          onClick={() => setMessage(null)}
          aria-label="Close"
        >
          <span style={{lineHeight: 0}} aria-hidden="true">&times;</span>
        </button>
        {message} Redirigiendo...
      </div>
      : null
    }

  return (
    <React.Fragment>
      {showError()}
      {showMessage()}
      <div className="login-with-google">
        <GoogleLogin
          clientId={googleClientId}
          buttonText="Iniciar sesión con Google"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          theme="dark"
        />
      </div>
    </React.Fragment>
  )
}

export default GoogleLoginComponent;