import Link from "next/link";
import Layout from "../../../components/Layout";
import Admin from "../../../components/auth/Admin";
import BlogEdit from "../../../components/crud/BlogEdit";

const Blog = () => {
  return (
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
  )
}

export default Blog;