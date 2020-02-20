import {useEffect} from "react";
import Router from "next/router";
import Head from "next/head";
import {isAuth} from "../actions/auth";
import Layout from "../components/Layout";
import ForgotPasswordComponent from "../components/auth/ForgotPasswordComponent";

const APP_NAME = process.env.APP_NAME;

const head = () => {
  return (
    <Head>
      <title>Restablecer contraseña | {APP_NAME}</title>
    </Head>
  )
}

const ForgotPassword = () => {
  useEffect(() => {
    if(isAuth()) {
      Router.push("/")
    }
  }, []);

  return (
    <React.Fragment>
      {head()}
      <Layout>
        <h2 className="text-center mb-2">Restablecer contraseña</h2>
        <p className="text-center mb-5">Se enviará un email con instrucciones para restablecer su contraseña</p>
        <div className="row mx-0">
          <div className="col-md-6 offset-md-3">
            <ForgotPasswordComponent />
          </div>
        </div>
      </Layout>
    </React.Fragment>
  );
}

export default ForgotPassword;
