import axios from "axios";
import { API } from "../config";

// Funcionalidad para crear categorías
export const createTag = async (name, token) => {
  return await axios({
    method: "POST",
    url: `${API}/api/tag`,
    data: {
      name
    },
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
}

// Funcionalidad para tomar todas las categorías
export const getAllTags = async () => {
  return await axios({
    method: "GET",
    url: `${API}/api/tags`
  })
}

// Funcionalidad para tomar una categoría específica
export const getTag = async (slug) => {
  return await axios({
    method: "GET",
    url: `${API}/api/tag/${slug}`
  })
}

// Funcionalidad para borrar una categoría
export const deleteTag = async (slug, token) => {
  return await axios({
    method: "DELETE",
    url: `${API}/api/tag/${slug}`,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}