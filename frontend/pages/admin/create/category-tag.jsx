import Link from "next/link";
import Layout from "../../../components/Layout";
import Admin from "../../../components/auth/Admin";
import Category from "../../../components/crud/Category";

const categoryTag = () => {
  return (
    <Layout>
      <Admin>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 mb-5">
              <h2>Administrar Categorías y Tags</h2>
            </div>
            <div className="col-md-4">
              <Category />
            </div>
            <div className="col-md-8">
              <p>Tags</p>
            </div>
          </div>
        </div>
      </Admin>
    </Layout>
  )
}

export default categoryTag;