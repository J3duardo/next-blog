import Head from "next/head";
import Link from "next/link";
import {withRouter} from "next/router";
import moment from "moment";
moment.locale("es")
import Layout from "../../components/Layout";
import {getPublicUserProfile} from "../../actions/user";
import {API, DOMAIN, APP_NAME} from "../../config";

const UserPublicProfile = (props) => {
  console.log(props);
  const {user, error} = props;

  const renderUserBlogs = () => {
    return props.userBlogs.map(blog => {
      return (
        <div key={blog._id}>
          <Link href="/blogs/[slug]" as={`/blogs/${blog.slug}`}>
            <a className="lead font-weight-normal">{blog.title}</a>
          </Link>
        </div>
      )
    })
  }

  // Contenido del Head de la página para SEO
  const head = () => {
    return (
      <Head>
        <title>{!error ? user.name : error} | {APP_NAME}</title>
        <meta name="description" content={!error ? "Blogs de " + user.username : error}/>
        <meta property="og:title" content={!error ? "Blogs de " + user.username : error}/>
        <meta property="og:description" content={!error ? "Blogs de " + user.username : error}/>
        <meta property="og:type" content="web site" />
        <meta property="og:url" content={`${DOMAIN}${props.router.asPath}`} />
        <meta property="og:site_name" content={`${DOMAIN}`} />
        <meta property="og:image" content={`/images/ogimage.jpg`} />
        <meta property="og:image:secure_url" content={`/images/ogimage.jpg`} />
        <meta property="og:image:type" content={"image/jpg"} />
        <link rel="canonical" href={`${DOMAIN}${props.router.asPath}`}/>
      </Head>
    )
  }

  return (
    <React.Fragment>
      {head()}
      <Layout>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <h5>{props.user.name}</h5>
                  <Link href={`${props.user.profile}`}>
                    <a>Ver perfil</a>
                  </Link>
                  <p className="text-muted">
                    Miembro desde: {moment(props.user.createdAt).calendar()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br/>
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="text-white text-center card-title bg-primary py-3 px-3">
                    Blogs recientes de {props.user.name}
                  </h5>
                  <hr/>
                  {renderUserBlogs()}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="text-white text-center card-title bg-primary py-3 px-3">
                    Contactar a {props.user.name}
                  </h5>
                  <hr/>
                  <p>Formulario de contacto</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </React.Fragment>
  )
}

UserPublicProfile.getInitialProps = async (props) => {
  try {
    const res = await getPublicUserProfile(props.query.username);
    return {
      user: res.data.data.user,
      userBlogs: res.data.data.userBlogs
    }
  } catch (error) {
    if(error.response) {
      return {
        error: error.response.data.message
      }
    }

    if(error.message.includes("Network") || error.message.includes("ECONNREFUSED")) {
      return {
        error: "Error de conexión. Intente de nuevo."
      }
    }

    return {
      error: error.message
    }
  }
}

export default withRouter(UserPublicProfile);