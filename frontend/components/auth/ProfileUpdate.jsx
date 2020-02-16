import {useState, useEffect, useRef} from "react";
import Router, {withRouter} from "next/router";
import {getCurrentUserProfile, updateCurrentUserProfile} from "../../actions/user";
import {getCookie, updateUserAuthData} from "../../actions/auth";
import {API} from "../../config";

const ProfileUpdate = () => {
  const [username, setUsername] = useState("");
  const[photoSrcUsername, setPhotoSrcUsername] = useState("")
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [photo, setPhoto] = useState("");
  const [about, setAbout] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const imgRef = useRef();
  const [imgPreview, setImgPreview] = useState(null);

  // Funcionalidad para cargar el perfil del usuario actual
  const getProfile = async () => {
    try {
      const res = await getCurrentUserProfile(getCookie("token"));
      
      setUsername(res.data.profile.username);
      setPhotoSrcUsername(res.data.profile.username);
      setName(res.data.profile.name);
      setEmail(res.data.profile.email);
      setPhoto(res.data.profile.photo);
      setAbout(res.data.profile.about);

    } catch (error) {
      setLoading(false);
      setSuccess(false);

      if(error.response) {
        return setError(error.message)
      }

      if(error.message.includes("Network") || error.message.includes("ECONNREFUSED")) {
        return setError("Error de conexión. Intente de nuevo")
      }

      return setError(error.message);
    }
  }
  
  useEffect(() => {
    getProfile()
  }, []);

  const onChangeHandler = (e) => {
    setError(null);

    switch(e.target.name) {
      case("username"):
        setUsername(e.target.value);
      break;
      case("name"):
        setName(e.target.value);
      break;
      case("email"):
        setEmail(e.target.value);
      break;
      case("currentPassword"):
        setCurrentPassword(e.target.value);
      break;
      case("password"):
        setPassword(e.target.value);
      break;
      case("passwordConfirm"):
        setPasswordConfirm(e.target.value);
      break;
      case("photo"):
        setPhoto(e.target.files[0]);
        setImgPreview(URL.createObjectURL(e.target.files[0]))
      break;
      case("about"):
        setAbout(e.target.value);
      break;
      default:
        return null;
    }
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const values = {};
    const formData = new FormData();

    values["username"] = username;
    values["name"] = name;
    values["email"] = email;
    values["currentPassword"] = currentPassword;
    values["password"] = password;
    values["passwordConfirm"] = passwordConfirm;
    values["photo"] = photo;
    values["about"] = about;

    for(let key in values) {
      formData.set(key, values[key])
    }
  
    try {
      setLoading(true);
      const res = await updateCurrentUserProfile(formData, getCookie("token"));
      setLoading(false);
      setSuccess(true);

      const {_id, name, username, email, role} = res.data.data;

      const userData = {
        id: _id,
        name,
        username,
        email,
        role
      }

      // Actualizar data del usuario almacenada en el localStorage
      updateUserAuthData(userData);

      // Redirigir al panel de control del usuario
      setTimeout(() => {
        Router.push("/user");        
      }, 2500);

    } catch (error) {
      setLoading(false);
      setSuccess(false);

      if(error.response) {
        return setError(error.response.data.message)
      }

      if(error.message.includes("Network") || error.message.includes("ECONNREFUSED")) {
        return setError("Error de conexión. Intente nuevamente.")
      }

      setError(error.message)
    }
  }

  // Cargar imagen por defecto si el usuario no tiene imagen de perfil
  const loadDefaultImg = () => {
    imgRef.current.src = "/images/default-profile.jpg";
  }

  const showError = () => {
  return error ?
    <div
      style={{position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", zIndex: 10}}
      className="alert alert-danger text-center"
    >
      {error}
    </div>
    : null
  }

  const showMessage = () => {
  return success ?
    <div
      style={{position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", zIndex: 10}}
      className="alert alert-info text-center"
    >
      Perfil actualizado correctamente. Redirigiendo...
    </div>
    : null
  }

  return (
    <React.Fragment>
      {showError()}
      {showMessage()}
      <div className="container">
        <h3 className="mb-4">Actualizar perfil</h3>
        <div className="row">
          <div className="col-md-4">
            <img
              ref={imgRef}
              src={`${API}/api/user/photo/${photoSrcUsername}`}
              alt={`Foto de ${photoSrcUsername}`}
              className="img img-fluid img-thumbnail mb-2"
              style={{maxHeight: "auto", maxWidth:"100%"}}
              onError={loadDefaultImg}
            />
            <label
              htmlFor="photo"
              className="btn btn-outline-info"
            >
              Actualiza tu foto de perfil
            </label>
            <br/>
            <small className="text-muted">La imagen debe ser menor de 1MB</small>
            <hr className="mb-2"/>
            {imgPreview &&
              <div style={{maxWidth: "250px", margin: "0 auto"}}>
                <img
                  style={{display: "block", width: "100%"}}
                  className="img img-fluid img-thumbnail"
                  src={imgPreview} alt="avatar preview"
                />
                <small style={{display: "block", textAlign: "center"}} className="text-muted">Preview de la imagen</small>
              </div>
            }
          </div>
          <div className="col-md-8">
            <form onSubmit={onSubmitHandler}>
              <div>
                <input
                  className="form-control"
                  type="file"
                  name="photo"
                  id="photo"
                  hidden
                  accept="image/*"
                  onChange={onChangeHandler}
                />
              </div>
              <div className="form-group">
                <label htmlFor="username" className="text-muted font-weight-bold">Username</label>
                <input
                  className={`form-control ${error && error.toLowerCase().includes("username") && "input-error"}`}
                  type="text"
                  name="username"
                  id="username"
                  onChange={onChangeHandler}
                  value={username}
                  placeholder="Tu nombre de usuario"
                />
              </div>
              <div className="form-group">
                <label htmlFor="name" className="text-muted font-weight-bold">Nombre</label>
                <input
                  className={`form-control ${error && error.toLowerCase().includes("nombre") && "input-error"}`}
                  type="text"
                  name="name"
                  id="name"
                  onChange={onChangeHandler}
                  value={name}
                  placeholder="Tu nombre real"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email" className="text-muted font-weight-bold">Email</label>
                <input
                  className={`form-control ${error && error.toLowerCase().includes("email") && "input-error"}`}
                  type="email"
                  name="email"
                  id="email"
                  onChange={onChangeHandler}
                  value={email}
                  placeholder="Introduce un email válido"
                />
              </div>
              <div className="form-group">
                <label htmlFor="about" className="text-muted font-weight-bold">Acerca de ti</label>
                <textarea
                  className="form-control"
                  name="about"
                  id="about"
                  onChange={onChangeHandler}
                  value={about}
                  placeholder="Escribe algo interesante sobre ti"
                />
              </div>
              <div className="mb-3" style={{padding: "10px", border: "1px solid #ccc", borderRadius: "5px"}}>
                <h5 className="mb-0">Actualizar contraseña</h5>
                <small style={{display: "block"}} className="text-muted mb-3">Dejar en blanco para conservar su contraseña actual</small>
                <div className="form-group">
                  <input
                    className={`form-control ${error && error.toLowerCase().includes("contraseña incorrecta") && "input-error"}`}
                    type="password"
                    name="currentPassword"
                    id="currentPassword"
                    onChange={onChangeHandler}
                    value={currentPassword}
                    placeholder="Contraseña actual"
                  />
                </div>
                <div className="form-group">
                  <input
                    className={`form-control ${error && error.includes("contraseñas no coinciden") ? "input-error" : error && error.includes("debe contener al menos 6 caracteres") ? "input-error" : ""}`}
                    type="password"
                    name="password"
                    id="password"
                    onChange={onChangeHandler}
                    value={password}
                    placeholder="Tu nueva contraseña"
                  />
                </div>
                <div className="form-group">
                  <input
                    className={`form-control ${error && error.includes("contraseñas no coinciden") ? "input-error" : error && error.includes("debe contener al menos 6 caracteres") ? "input-error" : ""}`}
                    type="password"
                    name="passwordConfirm"
                    id="passwordConfirm"
                    onChange={onChangeHandler}
                    value={passwordConfirm}
                    placeholder="Confirma tu nueva contraseña"
                  />
                </div>
              </div>
              <div>
                <button
                  disabled={loading}
                  type="submit"
                  className="btn btn-primary btn-block"
                >
                  {loading &&
                    <span
                      style={{marginRight: "5px"}}
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    />
                  }
                  Actualizar perfil
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default withRouter(ProfileUpdate);