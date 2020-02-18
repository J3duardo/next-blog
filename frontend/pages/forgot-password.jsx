import {useEffect} from "react";
import Router from "next/router";
import {isAuth} from "../actions/auth";
import Layout from "../components/Layout";
import ForgotPasswordComponent from "../components/auth/ForgotPasswordComponent";

const ForgotPassword = () => {
  useEffect(() => {
    if(isAuth()) {
      Router.push("/")
    }
  }, []);

  return (
    <Layout>
      <h2 className="text-center mb-2">Restablecer contraseña</h2>
      <p className="text-center mb-5">Se enviará un email con instrucciones para restablecer su contraseña</p>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <ForgotPasswordComponent />
        </div>
      </div>
    </Layout>
  );
}

export default ForgotPassword;
