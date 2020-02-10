import {useState} from "react";
import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";
import {getBlogsWithCategoriesAndTags} from "../../actions/blog";
import Card from "../../components/blog/Card";

const Blogs = (props) => {
  const {blogs, categories, tags, results} = props;
  console.log(props)

  const renderAllCategories = () => {
    return categories.map(category => {
      return (
        <Link key={category._id} href={`/category/${category.slug}`}>
          <a className="btn btn-primary btn-sm mr-1 ml-1">{category.name}</a>
        </Link>
      )
    })
  }

  const renderAllTags = () => {
    return tags.map(tag => {
      return (
        <Link key={tag._id} href={`/category/${tag.slug}`}>
          <a className="btn btn-outline-primary btn-sm mr-1 ml-1">{tag.name}</a>
        </Link>
      )
    })
  }

  const renderBlogs = () => {
    return blogs.map(blog => {
      return (
        <article key={blog._id} className="mb-4">
          <Card blog={blog} />
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
              <h1 className="text-center font-weight-bold mb-4">
                Blogs y tutoriales de programación
              </h1>
            </div>
            <section className="mb-4">
              <div className="mb-3">
                {renderAllCategories()}
              </div>
              <div>
                {renderAllTags()}
              </div>
            </section>
          </header>
        </div>
        <hr/>
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