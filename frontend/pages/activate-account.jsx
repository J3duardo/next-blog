import {useEffect, useState} from "react";
import Router, {withRouter} from "next/router";
import Link from "next/link";
import Head from "next/head";
import {isAuth, activateAccount} from "../actions/auth";
import Layout from "../components/Layout";

const APP_NAME = process.env.APP_NAME;

const head = () => {
  return (
    <Head>
      <title>Registrarse | {APP_NAME}</title>
    </Head>
  )
}

const ActivateAccount = (props) => {
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Redirigir si el usuario está autenticado
  useEffect(() => {
    if(isAuth()) {
      Router.push("/")
    }
  }, []);

  // Enviar el token para activar la cuenta
  useEffect(() => {
    activateUserAccount(props.token)
  }, []);
  
  const activateUserAccount = async (token) => {
    try {
      setLoading(true);
      setMessage(null);
      setError(null);
      
      const res = await activateAccount(token);  

      setLoading(false);
      setMessage(res.data.message);
      setError(null);

    } catch (error) {
      setLoading(false);
      setMessage(null);
      
      if(error.response) {
        setError(error.response.data.message);
        return;
      }

      if(error.message.includes("Network") || error.message.includes("ECONNREFUSED")) {
        setError("Error de conexión. Intente de nuevo.");
        return;
      }

      setError(error.message);
      return;
    }
  }

  return (
    <React.Fragment>
      {head()}
      <Layout>
        <div className="row mx-0">
          <div className="col-md-6 offset-md-3">
            <div className="jumbotron text-center">
              <h1>Activación de cuenta</h1>
              <p className="lead">Por favor, espere mientras procesamos su información...</p>
              <hr className="my-4"/>
              {loading &&
                <div className="d-flex justify-content-center align-items-center">
                  <div className="spinner-border" style={{width: "3rem", height: "3rem"}} role="status">
                    <span className="sr-only">Cargando...</span>
                  </div>
                </div>
              }
              {error &&
                <React.Fragment>
                  <p className="lead">Ocurrió un error al procesar su información</p>
                  <p className="text-danger lead font-weight-bold">{error}</p>
                  {error.includes("expirado") &&
                    <button onClick={() => Router.push("/signup")} className="btn btn-secondary mt-3">Intentar de nuevo</button>
                  }
                  {error.includes("conexión") &&
                    <button onClick={() => activateUserAccount(props.token)} className="btn btn-secondary mt-3">Intentar de nuevo</button>
                  }
                </React.Fragment>
              }
              {message &&
                <React.Fragment>
                  <p className="lead font-weight-bold">{message}</p>
                  <Link href="/login">
                    <a className="btn btn-primary">Iniciar sesión</a>
                  </Link>
                </React.Fragment>
              }
            </div>
          </div>
        </div>
      </Layout>
    </React.Fragment>
  );
}

ActivateAccount.getInitialProps = ({query}) => {
  return {
    token: query.token
  }
}

export default withRouter(ActivateAccount);
