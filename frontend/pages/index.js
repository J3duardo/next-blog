import {useEffect} from "react";
import Link from "next/link";
import Router from "next/router";
import {withRouter} from "next/router";
import Head from "next/head";
import {isAuth} from "../actions/auth";
import Layout from "../components/Layout";
import LoginComponent from "../components/auth/LoginComponent";
const APP_NAME = process.env.APP_NAME;
const DOMAIN = process.env.NODE_ENV === "production" ? process.env.DOMAIN_PROD : process.env.DOMAIN_DEV;

const Index = (props) => {
  useEffect(() => {
    if(isAuth()) {
      Router.push("/user")
    }
  }, []);

  const head = () => {  
    return (
      <Head>
        <title>Home | {APP_NAME}</title>
        <meta
          name="description"
          content="Blogs y tutoriales sobre tecnologías web."
        />
        <meta
          property="og:title"
          content={`Blogs y tutoriales sobre tecnologías web.`}
        />
        <meta
          property="og:description"
          content="Blogs y tutoriales sobre tecnologías web."
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
          content={`${DOMAIN}/images/landing-background.jpg`}
        />
        <meta
          property="og:image:secure_url"
          content={`${DOMAIN}/images/landing-background.jpg`}
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
    <div className="landing-page">
      {head()}
      <Layout>
        <div className="container-fluid mb-5 px-5">
          <div className="row">
            <div className="col-lg-8 landing-page__container mb-4">
              <h1 className="display-4 font-weight-bold text-light mb-3">Entérate de lo más actual <br/> en el mundo de <br/> las Tecnologías Web</h1>
              <p className="lead text-light mb-0">Encuentra blogs y tutoriales sobre los últimos avances en tecnologías web.</p>
              <p className="lead text-light mb-5">Crea tus propios blogs, compártelos e interactúa con otros usuarios.</p>
              <div className="landing-page__btns">
                <Link href="/blogs">
                  <a className="btn btn-generic mr-3">Ver blogs</a>
                </Link>
                <Link href="/signup">
                  <a className="btn btn-action">Registrarse</a>                
                </Link>
              </div>
            </div>
            <div
              className="col-lg-4 p-4 border border-dark rounded landing-page__login"
              style={{
                maxWidth: "550px",
                margin: "0 auto",
                backdropFilter: "blur(5px)",
                background: "rgba(0, 0, 0, 0.1)",
              }}
            >
              <h2
                style={{textShadow: "1px 1px 1px rgb(0, 0, 0)"}}
                className="display-5 text-center font-weight-bold text-light mb-3"
              >
                Iniciar sesión
              </h2>
              <LoginComponent />
            </div>
          </div>
        </div>
      </Layout>
    </div>
  )  
}

export default withRouter(Index);