import Link from "next/link";
import Head from "next/head";
import Layout from "../../../components/Layout";
import Admin from "../../../components/auth/Admin";
import BlogEdit from "../../../components/crud/BlogEdit";
const APP_NAME = process.env.APP_NAME;

const head = () => {
  return (
    <Head>
      <title>Editar blog | {APP_NAME}</title>
    </Head>
  )
}

const Blog = () => {
  return (
    <React.Fragment>
      {head()}
      <Layout>
        <Admin>
          <div className="container-fluid">
            <div className="row mx-0">
              <div className="col-md-12 mb-3">
                <h2>Editar blog</h2>
              </div>
              <div className="col-md-12">
                <BlogEdit />
              </div>
            </div>
          </div>
        </Admin>
      </Layout>
    </React.Fragment>
  )
}

export default Blog;