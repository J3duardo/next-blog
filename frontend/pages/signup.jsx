import {useEffect} from "react";
import Router from "next/router";
import Head from "next/head";
import Layout from "../components/Layout";
import SignupComponent from "../components/auth/SignupComponent";
import {isAuth} from "../actions/auth";

const APP_NAME = process.env.APP_NAME;

const head = () => {
  return (
    <Head>
      <title>Registrarse | {APP_NAME}</title>
    </Head>
  )
}

const Signup = () => {
  useEffect(() => {
    if(isAuth()) {
      Router.push("/")
    }
  }, []);

  return (
    <React.Fragment>
      {head()}
      <Layout>
        <h2 className="text-center mb-2">Registrarse</h2>
        <small
          style={{display: "block"}}
          className="text-muted text-center mb-4"
        >
          Se eviará un email a su correo para activar su cuenta
        </small>
        <div className="row mx-0">
          <div className="col-md-6 offset-md-3">
            <SignupComponent />
          </div>
        </div>
      </Layout>
    </React.Fragment>
  );
}

export default Signup;