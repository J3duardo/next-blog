import {useState} from "react";
import moment from "moment";
moment.locale("es");
import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";
import {getBlogsWithCategoriesAndTags} from "../../actions/blog";
import {API} from "../../config";

const Blogs = (props) => {
  const {blogs, categories, tags, results} = props;
  console.log(props)

  const renderBlogs = () => {
    return blogs.map(blog => {
      return (
        <article key={blog._id}>
          <div className="lead">
            <header>
              <Link href={`/blog/${blog.slug}`}>
                <a><h2 className="font-weight-bold">{blog.title}</h2></a>
              </Link>
            </header>
            <section>
              <p className="mark ml-1">
                Autor: {blog.postedBy.name} | Actualizado: {moment(blog.updatedAt).calendar()}
              </p>
            </section>
            <section>
              <p>Categorías y tags</p>
            </section>
            <div className="row">
              <div className="col-md-4">Imagen</div>
              <div className="col-md-8">
                <section>
                  {blog.excerpt}{" "}
                  <Link href={`/blog/${blog.slug}`}>
                    <a>Leer más...</a>
                  </Link>
                </section>
              </div>
            </div>
          </div>
          <hr/>
        </article>
      )
    })
  }

  return (
    <Layout>
      <main>
        <div className="container-fluid">
          <header>
            <div className="col-md-12">
              <h1 className="text-center font-weight-bold">
                Blogs y tutoriales de programación
              </h1>
            </div>
            <section>
              <p>Mostrar categorías y tags</p>
            </section>
          </header>
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              {renderBlogs()}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}

Blogs.getInitialProps = async () => {
  try {
    const res = await getBlogsWithCategoriesAndTags()
    return {
      blogs: res.data.data.blogs,
      categories: res.data.data.categories,
      tags: res.data.data.tags,
      results: res.data.data.results
    }
  } catch (error) {
    console.log(error)
  }
}

export default Blogs;