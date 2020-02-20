import Head from "next/head";
import {withRouter} from "next/router";
import {getTag} from "../../actions/tag";
import Layout from "../../components/Layout";
import Card from "../../components/blog/Card";
// import {DOMAIN, APP_NAME} from "../../config";

const APP_NAME = process.env.APP_NAME;
const DOMAIN = process.env.NODE_ENV === "production" ? process.env.DOMAIN_PROD : process.env.DOMAIN_DEV;

const BlogsByTag = (props) => {

  // Mostrar los blogs
  const renderBlogs = () => {
    return props.blogs.map(blog => {
      return (
        <div key={blog._id} className="mb-4">
          <Card blog={blog} />
        </div>
      )
    })
  }

  // Contenido del Head de la página para SEO
  const head = () => {
    return (
      <Head>
        <title>Blogs sobre {!props.error && props.tag.name} | {APP_NAME}</title>
        <meta
          name="description"
          content={`Blogs y tutoriales sobre ${!props.error && props.tag.name}`}
        />
        <meta
          property="og:title"
          content={`Los blogs más recientes sobre ${!props.error && props.tag.name}`}
        />
        <meta
          property="og:description"
          content={`Blogs y tutoriales sobre ${!props.error && props.tag.name}`}
        />
        <meta
          property="og:type"
          content="web site"
        />
        <meta
          property="og:url"
          content={`${DOMAIN}${props.router.asPath}`}
        />
        <meta
          property="og:site_name"
          content={`${DOMAIN}`}
        />
        <meta
          property="og:image"
          content={`/images/ogimage.jpg`}
        />
        <meta
          property="og:image:secure_url"
          content={`/images/ogimage.jpg`}
        />
        <meta
          property="og:image:type"
          content={"image/jpg"}
        />
        <link rel="canonical" href={`${DOMAIN}${props.router.asPath}`}/>
      </Head>
    )
  }

  const showError = () => {
    return <div className="alert alert-danger text-center py-4"><h5>{props.error}</h5></div>
  }

  return (
    <React.Fragment>
      {head()}
      <Layout>
        <main>
          {props.error && showError()}
          <div className="container-fluid">
            <header>
              <div className="col-md-12">
                {!props.error ?
                  <h1 className="mb-5 text-center">
                      Blogs sobre{" "}
                      <span style={{fontWeight: "bolder", textTransform: "capitalize"}}>
                        {props.tag.name}
                      </span>                  
                  </h1>
                  :
                  <h1 className="mb-5 text-center">Error</h1>
                }
                {!props.error && renderBlogs()}
              </div>
            </header>
          </div>
        </main>
      </Layout>
    </React.Fragment>
  )
}

BlogsByTag.getInitialProps = async (props) => {
  try {
    const res = await getTag(props.query.slug);
    return {
      tag: res.data.data.tag,
      blogs: res.data.data.blogs
    }
  } catch (error) {
    if(error.message.includes("Network") || error.message.includes("ECONNREFUSED")) {
      return {
        error: "Error de conexión. Intente nuevamente"
      }
    }
    return {
      error: error.message
    }
  }
}

export default withRouter(BlogsByTag);