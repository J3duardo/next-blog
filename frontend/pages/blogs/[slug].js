import {useState, useEffect} from "react";
import Head from "next/head";
import Link from "next/link";
import {withRouter} from "next/router";
import moment from "moment";
import reactHTML from "react-render-html";
import {getSingleBlog, getRelatedBlogs} from "../../actions/blog";
import Layout from "../../components/Layout";
import SmallCard from "../../components/blog/SmallCard";
import DisqusThread from "../../components/DisqusThread";

const APP_NAME = process.env.APP_NAME;
const DOMAIN = process.env.NODE_ENV === "production" ? process.env.DOMAIN_PROD : process.env.DOMAIN_DEV;

const SingleBlog = (props) => {
  const [blog, setBlog] = useState(props.blog);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(props.error);

  // Cargar la data del blog seleccionado
  useEffect(() => {
    setBlog(props.blog);
    setError(props.error);
    // Buscar los blog relacionados
    loadRelatedBlogs();
  }, [props.blog]);

  // Funcionalidad para buscar los blogs relacionados
  const loadRelatedBlogs = async () => {
    try {
      setLoadingRelated(true);
      const res = await getRelatedBlogs({id: blog._id, categories: blog.categories});
      setRelatedBlogs(res.data.data.relatedBlogs);
      setLoadingRelated(false);
    } catch (error) {
      setLoadingRelated(false);
      console.log(error.message)
    }
  }

  // Mostrar las categorías del blog
  const renderCategories = () => {
    return blog.categories.map(category => {
      return (
        <Link key={category._id} href="/category/[slug]" as={`/category/${category.slug}`}>
          <a className="btn btn-dark btn-sm mr-1 ml-1">{category.name}</a>
        </Link>
      )
    })
  }

  // Mostrar los tags del blog
  const renderTags = () => {
    return blog.tags.map(tag => {
      return (
        <Link key={tag._id} href="/tag/[slug]" as={`/tag/${tag.slug}`}>
          <a className="btn btn-dark btn-sm mr-1 ml-1">{tag.name}</a>
        </Link>
      )
    })
  }

  // Mostrar los blogs relacionados
  const renderRelatedBlogs = () => {
    return relatedBlogs.map(blog => {
      return (
        <div key={blog._id} className="col-md-4">
          <article>
            <SmallCard blog={blog} />
          </article>
        </div>
      )
    })
  }

  // Mostrar comentarios con Disqus
  const renderComments = () => {
    return (
      <div>
        <DisqusThread
          id={blog._id}
          title={blog.title}
          path={`/blog/${blog.slug}`}
        />
      </div>
    )
  }

  // Meta tags específicos para cada blog
  const head = () => {
    return (
      <Head>
        <title>{!error ? blog.title : error} | {APP_NAME}</title>
        <meta
          name="description"
          content={!error ? blog.mdescription : error}
        />
        <meta
          property="og:title"
          content={`${!error ? blog.title : error} | ${APP_NAME}`}
        />
        <meta
          property="og:description"
          content={`${!error ? blog.mdescription : error}`}
        />
        <meta
          property="og:type"
          content="web site"
        />
        <meta
          property="og:url"
          content={`${DOMAIN}/blogs${props.router.asPath}`}
        />
        <meta
          property="og:site_name"
          content={`${APP_NAME}`}
        />
        <meta
          property="og:image"
          content={!error ? blog.mainPhoto || `${DOMAIN}/images/landing-background.jpg` : ""}
        />
        <meta
          property="og:image:secure_url"
          content={!error ? blog.mainPhoto || `${DOMAIN}/images/landing-background.jpg` : ""}
        />
        <meta
          property="og:image:type"
          content="image/jpg"
        />
        <link rel="canonical" href={`${DOMAIN}/blogs${props.router.asPath}`}/>
      </Head>
    )
  }

  const showError = () => {
    return <div className="alert alert-danger text-center py-4"><h5>{error}</h5></div>
  }

  return (
    <React.Fragment>
      {head()}
      <Layout>
        <main>
          {error && showError()}
          {!error &&
            <article>
              <div className="container-fluid">
                <section className="mb-4">
                  <div className="container">
                    <div style={{position: "relative", minHeight: "250px"}} className="row px-0">
                      {loading &&
                        <div
                          style={{position: "absolute", width: "100%", minHeight: "250px", backgroundColor: "#fff"}}
                          className="d-flex align-items-center justify-content-center"
                        >
                          <div className="spinner-border text-primary" role="status">
                            <span className="sr-only">Cargando...</span>
                          </div>
                        </div>
                      }
                      <img
                        className="img img-fluid blog-image"
                        src={blog.mainPhoto}
                        alt={`${blog.title}`}
                      />
                    </div>
                  </div>
                </section>
                <section className="mb-4">
                  <div className="container">
                    <h1 className="display-4 mb-4 text-center font-weight-bold">{blog.title}</h1>
                    <p className="lead mark">
                      Autor: <Link href="/profile/[username]" as={`/profile/${blog.postedBy.username}`}><a>{blog.postedBy.name}</a></Link>
                      {" | "}
                      Creado: {moment(blog.createdAt).calendar()} | Actualizado: {moment(blog.updatedAt).calendar()}
                    </p>
                  </div>
                </section>
                <section className="mb-4">
                  <div className="container">
                    {renderCategories()}
                    {renderTags()}
                  </div>
                </section>
                <div className="container mb-4">
                  <section>
                    <div className="col-md-12 px-0 lead">
                      {reactHTML(blog.body)}
                    </div>
                  </section>
                </div>
              </div>
              <div style={{position: "relative"}} className="container mb-4">
                <h5 className="text-center">Blogs relacionados:</h5>
                {loadingRelated &&
                  <div
                    style={{position: "absolute", width: "100%", height: "150px", backgroundColor: "#fff"}}
                    className="d-flex align-items-center justify-content-center pb-5"
                  >
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Cargando...</span>
                    </div>
                  </div>
                }
                <hr/>
                <div className="row">
                  {renderRelatedBlogs()}
                </div>
              </div>
              <div className="container mb-4">
                {renderComments()}
              </div>
            </article>          
          }
        </main>
      </Layout>
    </React.Fragment>
  )
}

SingleBlog.getInitialProps = async (props) => {
  try {
    const res = await getSingleBlog(props.query.slug);
    return {
      blog: res.data.data
    }
  } catch (error) {
    if(error.response) {
      return {
        error: error.response.data.message
      }
    }
    if(error.message.includes("Network") || error.message.includes("ECONNREFUSED")) {
      return {
        error: "Error al cargar los datos."
      }
    }
    return {
      error: error.message
    }
  }
}

export default withRouter(SingleBlog);