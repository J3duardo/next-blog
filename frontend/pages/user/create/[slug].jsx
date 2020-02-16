import Link from "next/link";
import Layout from "../../../components/Layout";
import Private from "../../../components/auth/Private";
import BlogEdit from "../../../components/crud/BlogEdit";

const Blog = () => {
  return (
    <Layout>
      <Private>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 mb-3">
              <h2>Editar blog</h2>
            </div>
            <div className="col-md-12">
              <BlogEdit />
            </div>
          </div>
        </div>
      </Private>
    </Layout>
  )
}

export default Blog;