import Router from "next/router";
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

// Funcionalidad para registrar nuevos usuarios mediante activación por email
export const preSignup = async (userData) => {
  return axios({
    method: "POST",
    url: `${API}/api/pre-signup`,
    data: {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      passwordConfirm: userData.passwordConfirm
    },
    headers: {
      "Content-Type": "application/json"
    }
  })
}

// Funcionalidad para activar la cuenta del usuario al comprobar el email
export const activateAccount = async (token) => {
  return axios({
    method: "GET",
    url: `${API}/api/activate-account?token=${token}`,
    headers: {
      Accept: "application/json"
    }
  })
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

// Funcionalidad para iniciar sesión con google
export const googleLogin = async (token) => {
  return await axios({
    method: "POST",
    url: `${API}/api/google-login`,
    data: {token},
    headers: {
      Accept: "application/json",
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
      return localStorage.getItem("user");
    }
  } else {
    return false;
  }
}

// Actualizar data del usuario en localStorage al actualizar perfil del usuario
export const updateUserAuthData = (userData) => {
  if(process.browser) {
    if(localStorage.getItem("user")) {
      const updatedData = JSON.stringify(userData)
      localStorage.setItem("user", updatedData);
    }
  }
}

// Manejar sesión expirada
export const sessionExpiredHandler = () => {
  removeCookie("token");
  localStorage.removeItem("user");
  setTimeout(() => {
    Router.push("/login")
  }, 2000);
}

// Enviar correo de restablecimiento de contraseña
export const sendResetPasswordEmail = async (email) => {
  return axios({
    method: "POST",
    url: `${API}/api/forgot-password`,
    data: {email},
    headers: {
      headers: {
        "Content-Type": "application/json"
      }
    }
  })
}

// Restablecer la contraseña
export const resetPassword = async (data) => {
  return axios({
    method: "POST",
    url: `${API}/api/reset-password`,
    data: {
      token: data.token,
      password: data.password,
      passwordConfirm: data.passwordConfirm
    },
    headers: {
      "Content-Type": "application/json"
    }
  })
}