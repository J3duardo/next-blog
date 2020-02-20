import Link from "next/link";
import Head from "next/head";
import Layout from "../../../components/Layout";
import Private from "../../../components/auth/Private";
import BlogCreate from "../../../components/crud/BlogCreate";
const APP_NAME = process.env.APP_NAME;

const head = () => {
  return (
    <Head>
      <title>Crear blog | {APP_NAME}</title>
    </Head>
  )
}

const CreateBlog = () => {
  return (
    <React.Fragment>
      {head()}
      <Layout>
        <Private>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12 mb-3">
                <h2>Crear un nuevo blog</h2>
              </div>
              <div className="col-md-12">
                <BlogCreate />
              </div>
            </div>
          </div>
        </Private>
      </Layout>
    </React.Fragment>
  )
}

export default CreateBlog;