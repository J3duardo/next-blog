import Head from "next/head";
import {withRouter} from "next/router";
import {getCategory} from "../../actions/category";
import Layout from "../../components/Layout";
import {DOMAIN, APP_NAME} from "../../config";
import Card from "../../components/blog/Card";

const BlogsByCategory = (props) => {

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
        <title>Blogs sobre {props.category.name} | {APP_NAME}</title>
        <meta
          name="description"
          content={`Blogs y tutoriales sobre ${props.category.name}`}
        />
        <meta
          property="og:title"
          content={`Los blogs más recientes sobre ${props.category.name}`}
        />
        <meta
          property="og:description"
          content={`Blogs y tutoriales sobre ${props.category.name}`}
        />
        <meta
          property="og:type"
          content="web site"
        />
        <meta
          property="og:url"
          content={`${DOMAIN}${props.router.pathname}`}
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
        <link rel="canonical" href={`${DOMAIN}${props.router.pathname}`}/>
      </Head>
    )
  }

  return (
    <React.Fragment>
      {head()}
      <Layout>
        <main>
          <div className="container-fluid">
            <header>
              <div className="col-md-12">
                <h1 className="mb-5 text-center">Blogs sobre <span style={{textTransform: "capitalize"}}>{props.category.name}</span></h1>
                {renderBlogs()}
              </div>
            </header>
          </div>
        </main>
      </Layout>
    </React.Fragment>
  )
}

BlogsByCategory.getInitialProps = async (props) => {
  try {
    const res = await getCategory(props.query.slug);
    return {
      category: res.data.data.category,
      blogs: res.data.data.blogs
    }
  } catch (error) {
    return {
      error: error.message
    }
  }
}

export default withRouter(BlogsByCategory);