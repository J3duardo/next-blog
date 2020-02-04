import Layout from "../components/Layout";
import Link from "next/link";
import SigninComponent from "../components/auth/SigninComponent";

const Login = () => {
  return (
    <Layout>
      <h2 className="text-center mb-4">Iniciar sesión</h2>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <SigninComponent />
        </div>
      </div>
    </Layout>
  );
}

export default Login;
