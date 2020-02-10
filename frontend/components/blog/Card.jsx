import {useRef} from "react";
import Link from "next/link";
import moment from "moment";
moment.locale("es");
import reactHTML from "react-render-html";
import {API} from "../../config";

const Card = (props) => {
  const {blog} = props;
  const imageRef = useRef()

  const renderCategories = () => {
    return blog.categories.map(category => {
      return (
        <Link key={category._id} href={`/category/${category.slug}`}>
          <a className="btn btn-primary btn-sm mr-1 ml-1">{category.name}</a>
        </Link>
      )
    })
  }

  const renderTags = () => {
    return blog.tags.map(tag => {
      return (
        <Link key={tag._id} href={`/category/${tag.slug}`}>
          <a className="btn btn-outline-primary btn-sm mr-1 ml-1">{tag.name}</a>
        </Link>
      )
    })
  }

  const setDefaultImage = () => {
    return imageRef.current.src="/images/noimage.png"
  }

  return (
    <div className="lead py-3 px-4 shadow">
      <header>
        <Link href={`/blog/${blog.slug}`}>
          <a><h2 className="font-weight-bold mb-3">{blog.title}</h2></a>
        </Link>
      </header>
      <section className="mb-3">
        <small style={{display: "inline-block", padding: "5px 10px"}} className="mark ml-1 text-muted text-small">
          Autor: {blog.postedBy.name} | Actualizado: {moment(blog.updatedAt).calendar()}
        </small>
      </section>
      <section className="mb-4" style={{display: "flex"}}>
        <div className="mr-2">
          <small className="text-muted">Categorías: </small>
          {renderCategories()}
        </div>
        <div>
          <small className="text-muted">Tags: </small>
          {renderTags()}
        </div>
      </section>
      <hr/>
      <div className="row">
        <div className="col-md-4">
          <section>
            <img
              ref={imageRef}
              className="img img-fluid"
              style={{display: "block", maxHeight: "150px", width: "auto"}}
              src={`${API}/api/blog/${blog.slug}/photo`}
              onError={setDefaultImage}
              alt={`${blog.title}`}
            />
          </section>
        </div>
        <div className="col-md-8">
          <section>
            {reactHTML(blog.excerpt)}{" "}
            <Link href={`/blog/${blog.slug}`}>
              <a className="btn btn-primary btn-sm">Leer más...</a>
            </Link>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Card;