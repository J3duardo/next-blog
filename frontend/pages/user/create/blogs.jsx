import Layout from "../../../components/Layout";
import Head from "next/head";
import Private from "../../../components/auth/Private";
import BlogRead from "../../../components/crud/BlogRead";
const APP_NAME = process.env.APP_NAME;

const head = () => {
  return (
    <Head>
      <title>Administrar blogs| {APP_NAME}</title>
    </Head>
  )
}

const Blog = () => {
  return (
    <React.Fragment>
      {head()}
      <Layout>
        <Private>
          <div className="container">
            <div className="row">
              <div className="col-md-12 mb-3">
                <h2>Administrar Blogs</h2>
              </div>
              <div className="col-md-12">
                <BlogRead />
              </div>
            </div>
          </div>
        </Private>
      </Layout>
    </React.Fragment>
  )
}

export default Blog;