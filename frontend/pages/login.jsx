import {useEffect} from "react";
import Router from "next/router";
import Head from "next/head";
import Layout from "../components/Layout";
import LoginComponent from "../components/auth/LoginComponent";
import {isAuth} from "../actions/auth";
const APP_NAME = process.env.APP_NAME;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const head = () => {
  return (
    <Head>
      <title>Iniciar sesión | {APP_NAME}</title>
      <meta name="google-signin-client_id" content={GOOGLE_CLIENT_ID}></meta>
    </Head>
  )
}

const Login = () => {
  useEffect(() => {
    if(isAuth()) {
      Router.push("/")
    }
  }, []);

  return (
    <React.Fragment>
      {head()}
      <Layout>
        <h2 className="text-center mb-4">Iniciar sesión</h2>
        <div className="row mx-0">
          <div className="col-md-6 offset-md-3">
            <LoginComponent />
          </div>
        </div>
      </Layout>
    </React.Fragment>
  );
}

export default Login;
