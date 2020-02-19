import {useEffect} from "react";
import Router, {withRouter} from "next/router";
import {isAuth} from "../actions/auth";
import Layout from "../components/Layout";
import ResetPasswordComponent from "../components/auth/ResetPasswordComponent";

const ResetPassword = (props) => {
  useEffect(() => {
    if(isAuth()) {
      Router.push("/")
    }
  }, []);

  return (
    <Layout>
      <h2 className="text-center mb-2">Restablecer contraseña</h2>
      <p className="text-center mb-5">Introduzca su nueva contraseña</p>
      <div className="row mx-0">
        <div className="col-md-6 offset-md-3">
          <ResetPasswordComponent token={props.router.query.token} />
        </div>
      </div>
    </Layout>
  );
}

export default withRouter(ResetPassword);
