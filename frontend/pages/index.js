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
    <React.Fragment>
      {head()}
      <Layout>
        <h2>Homepage</h2>
      </Layout>
    </React.Fragment>
  )
}

export default Index;