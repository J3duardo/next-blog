import Link from "next/link";
import Layout from "../../components/Layout";
import Private from "../../components/auth/Private";

const userIndex = () => {
  return (
    <Layout>
      <Private>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 mb-5">
              <h2>User dashboard</h2>
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
  )
}

export default userIndex;