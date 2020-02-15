import axios from "axios";
import {API} from "../config";

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
export const updateCurrentUserProfile = async (userdata, token) => {
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