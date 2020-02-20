import Link from "next/link";
import Head from "next/head";
import Layout from "../../components/Layout";
import Admin from "../../components/auth/Admin";
const APP_NAME = process.env.APP_NAME;

const head = () => {
  return (
    <Head>
      <title>Administrar | {APP_NAME}</title>
    </Head>
  )
}

const adminIndex = () => {
  return (
    <React.Fragment>
      {head()}
      <Layout>
        <Admin>
          <div className="container-fluid">
            <div className="row mx-0">
              <div className="col-md-12 mb-5">
                <h2>Admin dashboard</h2>
              </div>
              <div className="col-md-4">
                <ul className="list-group">
                  <li className="list-group-item">
                    <Link href="/admin/create/category-tag">
                      <a>Crear Categoría</a>
                    </Link>
                  </li>
                  <li className="list-group-item">
                    <Link href="/admin/create/category-tag">
                      <a>Crear Tag</a>
                    </Link>
                  </li>
                  <li className="list-group-item">
                    <a href="/admin/create/blog">Crear Blog</a>
                  </li>
                  <li className="list-group-item">
                    <Link href="/admin/create/blogs">
                      <a>Editar y Borrar Blogs</a>
                    </Link>
                  </li>
                  <li className="list-group-item">
                    <Link href="/user/update">
                      <a>Editar tu perfil de usuario</a>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Admin>
      </Layout>
    </React.Fragment>
  )
}

export default adminIndex;