import {useState, useEffect} from "react";
import Link from "next/link";
import Router from "next/router";
import {withRouter} from "next/router/";
import moment from "moment";
moment.locale("es");
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import {getCookie, isAuth, setCookie} from "../../actions/auth";
import {getAllBlogs, deleteBlog} from "../../actions/blog";

const BlogRead = (props) => {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [blogDeleted, setBlogDeleted] = useState(null);

  // Slug del blog a eliminar para que el modal pueda ejecutar la aliminación
  const [blogSlug, setBlogSlug] = useState(null);
  // State del modal
  const [modal, setModal] = useState(false);

  // Cargar la data de todos los blogs
  useEffect(() => {
    loadAllBlogs()
  }, []);

  // Funcionalidad para cargar todos los blogs
  const loadAllBlogs = async () => {
    try {
      const res = await getAllBlogs();
      setBlogs(res.data.data.blogs);

    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  }

  // Mostrar/ocultar modal de eliminación del blog
  const toggle = () => setModal(!modal);

  // Funcionalidad para borrar el blog
  const deleteBlogHandler = async (slug) => {
    try {
      setBlogDeleted(slug);
      setLoading(true);

      const token = getCookie("token");
      const res = await deleteBlog(slug, token);
      await loadAllBlogs();
      
      setLoading(false);
      setMessage(res.data.message)
      setBlogDeleted(null);
      clearMessages();

    } catch (error) {
      setLoading(false);
      setBlogDeleted(null);
      
      if(error.response) {
        clearMessages();
        return setError(error.response.data.message)
      }

      if(error.message.includes("Network")){
        clearMessages();
        return setError("Error de conexión. Intente nuevamente.")          
      }
      
      clearMessages();
      return setError(error.message)
    }
  }

  // Funcionalidad para mostrar todos los blogs
  const renderBlogs = () => {
    return blogs.map(blog => {
      return (
        <div key={blog._id} className="col-sm-12 mb-4">
          <h3 className="mb-3">{blog.title}</h3>
          <p className="mark mb-3">
            Autor: {blog.postedBy.name}
            {" | "}
            Creado: {moment(blog.updatedAt).calendar()}
          </p>
          {isAuth() && JSON.parse(isAuth()).role === 0 &&
            <Link href="/user/create/[slug]" as={`/user/create/${blog.slug}`}>
              <a className="btn btn-sm btn-primary mr-2">Editar blog</a>
            </Link>
          }
          {isAuth() && JSON.parse(isAuth()).role === 1 &&
            <Link href="/admin/create/[slug]" as={`/admin/create/${blog.slug}`}>
              <a className="btn btn-sm btn-primary mr-2">Editar blog</a>
            </Link>
          }
          <button
            className="btn btn-sm btn-danger"
            onClick={() => {setBlogSlug(blog.slug); toggle()}}
            disabled={loading && blogDeleted === blog.slug}
          >
            {loading && blogDeleted === blog.slug &&
              <span
                style={{marginRight: "5px"}}
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              />}
            Borrar blog
          </button>

          {/* Modal para comfirmar eliminación del blog */}
          <div>
            <Modal isOpen={modal} toggle={toggle}>
              <ModalHeader toggle={toggle}>Eliminar blog</ModalHeader>
              <ModalBody>
                ¿Está seguro de que desea eliminar este blog?
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onClick={() => {deleteBlogHandler(blogSlug); toggle()}}>Eliminar</Button>{" "}
                <Button color="secondary" onClick={() => {setBlogSlug(null); toggle()}}>Cancelar</Button>
              </ModalFooter>
            </Modal>
          </div>
        </div>
      )
    })
  }

  const showError = () => {
    return error ? <div className="alert alert-danger text-center">{error}</div> : null
  }
  
  const showSuccessMessage = () => {
    return message ?
    <div className="alert alert-info text-center">
      {message}
    </div>
    :
    null
  }

  const clearMessages = () => {
    setTimeout(() => {
      setError(null);
      setMessage(null)
    }, 3000)
  }

  return (
    <React.Fragment>
      {showSuccessMessage()}
      {showError()}
      <div className="row">
        {renderBlogs()}
      </div>
    </React.Fragment>
  )
}

export default BlogRead;