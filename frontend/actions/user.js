import axios from "axios";
// import {API} from "../config";
const API = process.env.NODE_ENV === "production" ? process.env.API : process.env.API_DEV;

// Buscar perfil público del usuario
export const getPublicUserProfile = async (username) => {
  return await axios({
    method: "GET",
    url: `${API}/api/user/${username}`,
    headers: {
      Accept: "application/json"
    }
  })
}

// Buscar perfil del usuario actual
export const getCurrentUserProfile = async (token) => {
  return await axios({
    method: "GET",
    url: `${API}/api/user/profile`,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  })
}

// Actualizar perfil del usuario actual
export const updateCurrentUserProfile = async (userData, token) => {
  return await axios({
    method: "PATCH",
    url: `${API}/api/user/update`,
    data: userData,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  })
}