import Layout from "../components/Layout";
import Link from "next/link";
import Head from "next/head";
const APP_NAME = process.env.APP_NAME;

const head = () => {
  return (
    <Head>
      <title>Home | {APP_NAME}</title>
    </Head>
  )
}

const Index = () => {
  return (
    <div className="landing-page">
      {head()}
      <Layout>
        <div className="container-fluid mb-5">
          <div className="row">
            <div className="col-md-8 landing-page__container">
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
          </div>
        </div>
      </Layout>
    </div>
  )
}

export default Index;