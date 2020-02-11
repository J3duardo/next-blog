import {useState, useRef, useEffect} from "react";
import Head from "next/head";
import Link from "next/link";
import {withRouter} from "next/router";
import moment from "moment";
import reactHTML from "react-render-html";
import {getSingleBlog} from "../../actions/blog";
import Layout from "../../components/Layout";
import {API, DOMAIN, APP_NAME} from "../../config";

const SingleBlog = (props) => {
  const [blog, setBlog] = useState(props.blog);
  const [error, setError] = useState(props.error);
  const blogImgRef = useRef();

  useEffect(() => {
    setBlog(props.blog);
    setError(props.error)
  }, [props.blog])

  const loadDefaultImg = () => {
    blogImgRef.current.src = "/images/noimage.png"
  }

  const renderCategories = () => {
    return blog.categories.map(category => {
      return (
        <Link key={category._id} href="/category/[slug]" as={`/category/${category.slug}`}>
          <a className="btn btn-primary btn-sm mr-1 ml-1">{category.name}</a>
        </Link>
      )
    })
  }

  const renderTags = () => {
    return blog.tags.map(tag => {
      return (
        <Link key={tag._id} href="/tag/[slug]" as={`/tag/${tag.slug}`}>
          <a className="btn btn-outline-primary btn-sm mr-1 ml-1">{tag.name}</a>
        </Link>
      )
    })
  }

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
          content={`${DOMAIN}/blogs/${props.router.pathname}`}
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
        <link rel="canonical" href={`${DOMAIN}/blogs/${props.router.pathname}`}/>
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
                  <div className="row">
                    <img
                      ref={blogImgRef}
                      className="img img-fluid blog-image"
                      src={`${API}/api/blog/${blog.slug}/photo`}
                      alt={`${blog.title}`}
                      onError={loadDefaultImg}
                    />
                  </div>
                </section>
                <section className="mb-4">
                  <div className="container">
                    <h1 className="display-4 mb-4 text-center font-weight-bold">{blog.title}</h1>
                    <p className="lead mark">
                      Autor: {blog.postedBy.name} | Actualizado: {moment(blog.updatedAt).calendar()}
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
              <div className="container mb-4">
                <h5 className="text-center">Blogs relacionados:</h5>
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