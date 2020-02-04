import Layout from "../components/Layout";
import Link from "next/link";

const Login = () => {
  return (
    <Layout>
      <h2>Login Page</h2>
      <Link href="/">
        <a>Home</a>
      </Link>
    </Layout>
  );
}

export default Login;
