import Layout from "../components/Layout";
import Head from "next/head";
import Private from "../components/auth/Private";
import DeleteUserAccount from "../components/auth/DeleteUserAccount";
const APP_NAME = process.env.APP_NAME;

const head = () => {
  return (
    <Head>
      <title>Eliminar Cuenta | {APP_NAME}</title>
    </Head>
  )
}

const UserProfileUpdate = () => {
  return (
    <React.Fragment>
      {head()}
      <Layout>
        <Private>
          <h2 className="text-center mb-1">Eliminar cuenta</h2>
          <small style={{display: "block"}} className="text-danger text-center mb-4">
            Esta acción no puede deshacerse y eliminará permanentemente todos sus datos personales y sus blogs creados.
          </small>
          <div className="container-fluid">
            <div className="row mx-0">
              <div className="col-md-6 offset-md-3">
                <DeleteUserAccount />
              </div>
            </div>
          </div>
        </Private>
      </Layout>
    </React.Fragment>
  )
}

export default UserProfileUpdate;