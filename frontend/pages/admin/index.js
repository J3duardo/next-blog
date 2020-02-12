import Link from "next/link";
import Layout from "../../components/Layout";
import Admin from "../../components/auth/Admin";

const adminIndex = () => {
  return (
    <Layout>
      <Admin>
        <div className="container-fluid">
          <div className="row">
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
                  <Link href="/admin/create/blog">
                    <a>Crear Blog</a>
                  </Link>
                </li>
                <li className="list-group-item">
                  <Link href="/admin/create/blogs">
                    <a>Editar y Borrar Blogs</a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Admin>
    </Layout>
  )
}

export default adminIndex;