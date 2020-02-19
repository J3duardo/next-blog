import Layout from "../../components/Layout";
import Private from "../../components/auth/Private";
import ProfileUpdate from "../../components/auth/ProfileUpdate";

const UserProfileUpdate = () => {
  return (
    <Layout>
      <Private>
        <div className="container-fluid">
          <div className="row mx-0">
            <ProfileUpdate />
          </div>
        </div>
      </Private>
    </Layout>
  )
}

export default UserProfileUpdate;