import Layout from "../components/Layout";
import LoginComponent from "../components/auth/LoginComponent";

const Login = () => {
  return (
    <Layout>
      <h2 className="text-center mb-4">Iniciar sesión</h2>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <LoginComponent />
        </div>
      </div>
    </Layout>
  );
}

export default Login;
