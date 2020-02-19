import {useState, useEffect} from "react";
import Link from "next/link";
import Router from "next/router";
import GoogleLogin from "react-google-login";
import {googleLogin, authenticateUser, isAuth} from "../../actions/auth";
import {GOOGLE_CLIENT_ID} from "../../config";

const GoogleLoginComponent = (props) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

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
        className="alert alert-danger"
      >
        {error}
      </div>
      : null
    }
  
    const showMessage = () => {
    return message ?
      <div
        style={{position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", zIndex: 10}}
        className="alert alert-info"
      >
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
          clientId={`${GOOGLE_CLIENT_ID}`}
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