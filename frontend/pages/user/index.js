import Link from "next/link";
import Head from "next/head";
import Layout from "../../components/Layout";
import Private from "../../components/auth/Private";
const APP_NAME = process.env.APP_NAME;

const head = () => {
  return (
    <Head>
      <title>Panel de control | {APP_NAME}</title>
    </Head>
  )
}

const userIndex = () => {
  return (
    <React.Fragment>
      {head()}
      <Layout>
        <Private>
          <div className="container-fluid">
            <div className="row mx-0">
              <div className="col-md-12 mb-5">
                <h2>Panel de control</h2>
              </div>
              <div className="col-md-4">
                <ul className="list-group">
                  <li className="list-group-item">
                    <a href="/user/create/blog">Crear Blog</a>
                  </li>
                  <li className="list-group-item">
                    <Link href="/user/create/blogs">
                      <a>Editar y Borrar Blogs</a>
                    </Link>
                  </li>
                  <li className="list-group-item">
                    <Link href="/user/update">
                      <a>Editar perfil</a>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Private>
      </Layout>
    </React.Fragment>
  )
}

export default userIndex;