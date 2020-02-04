import axios from "axios";
import {API} from "../config";
import cookieJs from "js-cookie";

// Funcionalidad para registrar nuevos usuarios
export const signup = async (userData) => {
  return await axios({
    method: "POST",
    url: `${API}/api/signup`,
    data: {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      passwordConfirm: userData.passwordConfirm
    },
    headers: {
      "Content-Type": "application/json"
    }
  });
}

// Funcionalidad para iniciar sesión
export const signin = async (userData) => {
  return await axios({
    method: "POST",
    url: `${API}/api/login`,
    data: {
      email: userData.email,
      password: userData.password
    },
    headers: {
      "Content-Type": "application/json"
    }
  })
}

// Funcionalidad para cerrar sesión
export const signout = async () => {
  removeCookie("token");
  removeLocalStorage("user");
  return await axios.get(`${API}/api/signout`);
}

// Crear cookie con el token de autenticación
export const setCookie = (key, val) => {
  if(process.browser) {
    cookieJs.set(key, val, {
      expires: 1
    })
  }
}

// Remover el cookie con el token de autenticación
export const removeCookie = (key) => {
  if(process.browser) {
    cookieJs.remove(key, {
      expires: 1
    })
  }
}

// Tomar el cookie con el token de autenticación
export const getCookie = (key) => {
  if(process.browser) {
    return cookieJs.get(key)
  }
}

// Guardar la data del usuario en el localStorage
export const setLocalStorage = (key, val) => {
  if(process.browser) {
    localStorage.setItem(key, JSON.stringify(val))
  }
}

// Remover data del usuario del localStorage
export const removeLocalStorage = (key) => {
  if(process.browser) {
    localStorage.removeItem(key)
  }
}

// Autenticar el usuario
export const authenticateUser = (data, callback) => {
  setCookie("token", data.token);
  setLocalStorage("user", data.user);
  callback();
}

// Chequear si hay usuario autenticado
export const isAuth = () => {
  if(process.browser) {
    const checkCookie = !!getCookie("token");
    if(checkCookie && localStorage.getItem("user")) {
      return true;
    }
  } else {
    return false;
  }
}