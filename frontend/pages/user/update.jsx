import Layout from "../../components/Layout";
import Head from "next/head";
import Private from "../../components/auth/Private";
import ProfileUpdate from "../../components/auth/ProfileUpdate";
const APP_NAME = process.env.APP_NAME;

const head = () => {
  return (
    <Head>
      <title>Actualizar perfil | {APP_NAME}</title>
    </Head>
  )
}

const UserProfileUpdate = () => {
  return (
    <React.Fragment>
      {head()}
      <Layout>
        <Private>
          <div className="container-fluid">
            <div className="row mx-0">
              <ProfileUpdate />
            </div>
          </div>
        </Private>
      </Layout>
    </React.Fragment>
  )
}

export default UserProfileUpdate;