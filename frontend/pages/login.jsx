import {useEffect} from "react";
import Router from "next/router";
import Layout from "../components/Layout";
import LoginComponent from "../components/auth/LoginComponent";
import {isAuth} from "../actions/auth";

const Login = () => {
  useEffect(() => {
    if(isAuth()) {
      Router.push("/")
    }
  }, []);

  return (
    <Layout>
      <h2 className="text-center mb-4">Iniciar sesión</h2>
      <div className="row mx-0">
        <div className="col-md-6 offset-md-3">
          <LoginComponent />
        </div>
      </div>
    </Layout>
  );
}

export default Login;
