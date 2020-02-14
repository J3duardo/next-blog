import {useState, useRef, useEffect} from "react";
import Head from "next/head";
import Link from "next/link";
import {withRouter} from "next/router";
import axios from "axios";
import moment from "moment";
import reactHTML from "react-render-html";
import {getSingleBlog, getRelatedBlogs} from "../../actions/blog";
import Layout from "../../components/Layout";
import SmallCard from "../../components/blog/SmallCard";
import {API, DOMAIN, APP_NAME} from "../../config";

const SingleBlog = (props) => {
  const [blog, setBlog] = useState(props.blog);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(props.error);
  const blogImgRef = useRef();

  // Cargar la data del blog seleccionado
  useEffect(() => {
    setBlog(props.blog);
    setError(props.error);
    // Buscar los blog relacionados
    loadRelatedBlogs();
  }, [props.blog]);

  // Cargar la imagen del blog al inicio y al cambiar la ruta
  useEffect(() => {
    if(!error || error && !error.includes("encontrado")) {
      loadBlogImage()
    }
  }, [props.router.asPath]);

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

  // Funcionalidad para cargar la imagen del blog o la imagen por defecto si el blog no contiene imagen
  const loadBlogImage = async () => {
    try {
      setLoading(true);
      blogImgRef.current.src = "";
      const res = await axios.get(`${API}/api/blog/${props.router.query.slug}/photo`);
      if(!res.data) {
        blogImgRef.current.src = "/images/noimage.png"
        blogImgRef.current.onload = () => setLoading(false);
      } else {
        blogImgRef.current.src = `${API}/api/blog/${props.router.query.slug}/photo`
        blogImgRef.current.onload = () => setLoading(false);
      }
    } catch (error) {
      blogImgRef.current.src = "/images/noimage.png"
      setLoading(false);
      console.log(error)
    }
  }

  // Mostrar las categorías del blog
  const renderCategories = () => {
    return blog.categories.map(category => {
      return (
        <Link key={category._id} href="/category/[slug]" as={`/category/${category.slug}`}>
          <a className="btn btn-primary btn-sm mr-1 ml-1">{category.name}</a>
        </Link>
      )
    })
  }

  // Mostrar los tags del blog
  const renderTags = () => {
    return blog.tags.map(tag => {
      return (
        <Link key={tag._id} href="/tag/[slug]" as={`/tag/${tag.slug}`}>
          <a className="btn btn-outline-primary btn-sm mr-1 ml-1">{tag.name}</a>
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
          content={`${DOMAIN}/blogs/${props.router.asPath}`}
        />
        <meta
          property="og:site_name"
          content={`${APP_NAME}`}
        />
        <meta
          property="og:image"
          content={!error ? `${API}/api/blog/${blog.slug}/photo` : ""}
        />
        <meta
          property="og:image:secure_url"
          content={!error ? `${API}/api/blog/${blog.slug}/photo` : ""}
        />
        <meta
          property="og:image:type"
          content="image/jpg"
        />
        <link rel="canonical" href={`${DOMAIN}/blogs/${props.router.asPath}`}/>
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
                  <div style={{position: "relative", minHeight: "250px"}} className="row">
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
                      ref={blogImgRef}
                      className="img img-fluid blog-image"
                      src=""
                      alt={`${blog.title}`}
                    />
                  </div>
                </section>
                <section className="mb-4">
                  <div className="container">
                    <h1 className="display-4 mb-4 text-center font-weight-bold">{blog.title}</h1>
                    <p className="lead mark">
                    Autor: <Link href="/profile/[username]" as={`/profile/${blog.postedBy.username}`}><a>{blog.postedBy.name}</a></Link>
                    {" | "}
                    Actualizado: {moment(blog.updatedAt).calendar()}
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
                <h5 className="text-center">Comentarios:</h5>
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