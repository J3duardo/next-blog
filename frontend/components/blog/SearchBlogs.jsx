import {useState} from "react";
import Link from "next/link";
import {searchBlogs} from "../../actions/blog";

const SearchBlogs = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Limpiar errores anteriores
    setError(null);

    try {
      if(!search.length > 0) {
        setError("Debe introducir un término de búsqueda");
        return;
      }
      setLoading(true);
      const res = await searchBlogs({search});
      setLoading(false);
      setResults(res.data.data);      
      setIsSearch(true);

      // Agregar una "S" al final del mensaje en función de la cantidad de resultados
      const s = res.data.data.length > 1 || res.data.data.length === 0 ? "s" : ""
      setMessage(`${res.data.data.length} blog${s} encontrado${s}.`)

    } catch (error) {
      if(error.message.includes("Network") || (error.message.includes("ECONNREFUSED"))) {
        setIsSearch(true);
        setLoading(false);
        return setError("Error de conexión. Intente de nuevo.")
      }
      setIsSearch(true);
      setLoading(false);
      return setError(error.message)
    }
  }
  
  const onChangeHandler = (e) => {
    setResults([]);
    setMessage(null);
    setIsSearch(false);
    setError(null);
    setSearch(e.target.value);
  }

  const renderResults = () => {
    return (
      <React.Fragment>
        {error &&
          <div className="jumbotron bg-white py-3 shadow">
            <div className="alert alert-danger text-center">{error}</div>
          </div>
        }
        {!error &&
          <div className="jumbotron bg-white py-3 shadow">
            {message && <p className="text-muted mb-2">{message}</p>}
            {results.map(blog => {
              return (
                <div key={blog._id}>
                  <Link href="/blogs/[slug]" as={`/blogs/${blog.slug}`}>
                    <a className="text-primary">{blog.title}</a>
                  </Link>
                </div>
              )
            })}
          </div>
        }
      </React.Fragment>
    )
  }

  return (
    <div className="container-fluid mt-3">
      <form onSubmit={onSubmitHandler}>
        <div className="row mx-0">
          <div className="col-md-8">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar blogs"
              autoComplete="off"
              onChange={onChangeHandler}
              value={search}
            />
          </div>
          <div className="col-md-4">
            <button
              className="btn btn-block btn-outline-primary"
              type="submit"
              disabled={loading}
            >
              {loading &&
                <span
                  style={{marginRight: "5px"}}
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                />
              }
              Buscar
            </button>
          </div>
        </div>
        {isSearch &&
          <div className="mt-2">
            {renderResults()}
          </div>
        }
      </form>
    </div>
  )
}

export default SearchBlogs;