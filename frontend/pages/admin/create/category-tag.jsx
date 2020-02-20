import Link from "next/link";
import Head from "next/head";
import Layout from "../../../components/Layout";
import Admin from "../../../components/auth/Admin";
import Category from "../../../components/crud/Category";
import Tag from "../../../components/crud/Tag";
const APP_NAME = process.env.APP_NAME;

const head = () => {
  return (
    <Head>
      <title>Crear categorías y tags | {APP_NAME}</title>
    </Head>
  )
}

const categoryTag = () => {
  return (
    <React.Fragment>
      {head()}
      <Layout>
        <Admin>
          <div className="container-fluid">
            <div className="row mx-0">
              <div className="col-md-12 mb-5">
                <h2>Administrar Categorías y Tags</h2>
              </div>
              <div className="col-md-6">
                <Category />
              </div>
              <div className="col-md-6">
                <Tag />
              </div>
            </div>
          </div>
        </Admin>
      </Layout>
    </React.Fragment>
  )
}

export default categoryTag;