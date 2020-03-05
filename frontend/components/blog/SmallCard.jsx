import {useEffect, useState} from "react";
import Link from "next/link";
import moment from "moment";
moment.locale("es");
import reactHTML from "react-render-html";

const SmallCard = (props) => {
  const {blog} = props;
  const [loading, setLoading] = useState(false);

  return (
    <React.Fragment>
      <div className="card">
        <section>
          <Link href={`/blogs/[slug]`} as={`/blogs/${blog.slug}`}>
            <a>
              <div style={{position: "relative", minHeight: "150px"}}>
                {loading &&
                  <div
                    style={{position: "absolute", width: "100%", height: "200px", backgroundColor: "#fff"}}
                    className="d-flex align-items-center justify-content-center"
                  >
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Cargando...</span>
                    </div>
                  </div>
                }
                <img
                  className="img img-fluid"
                  style={{display: "block", maxHeight: "200px", width: "100%", objectFit: "cover", objectPosition: "center"}}
                  src={blog.mainPhoto}
                  alt={`${blog.title}`}
                />
              </div>
            </a>
          </Link>
        </section>
        <div className="card-body pb-0">
          <section>
            <Link href={`/blogs/[slug]`} as={`/blogs/${blog.slug}`}>
              <a><h5 className="card-title">{blog.title}</h5></a>
            </Link>
            <p style={{marginBottom: 0}} className="card-text">{reactHTML(blog.excerpt)}</p>
          </section>
        </div>
        <div className="card-body pt-0">
          <Link href={`/blogs/[slug]`} as={`/blogs/${blog.slug}`}>
            <a className="btn btn-action btn-sm mb-3">Leer más...</a>
          </Link>
          <hr/>
          <p className="mb-0 text-muted">
            Creado: {moment(blog.createdAt).calendar()} | Actualizado: {moment(blog.updatedAt).calendar()}
          </p>
          <p className="mb-0 text-muted">
            Autor:  <Link href="/profile/[username]" as={`/profile/${blog.postedBy.username}`}>
                      <a>{blog.postedBy.name}</a>
                    </Link>
          </p>
        </div>
      </div>
    </React.Fragment>
  )
}

export default SmallCard;