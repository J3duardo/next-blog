import axios from "axios";
import { API } from "../config";

// Funcionalidad para crear categorías
export const createCategory = async (name, token) => {
  return await axios({
    method: "POST",
    url: `${API}/api/category`,
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
export const getAllCategories = async () => {
  return await axios({
    method: "GET",
    url: `${API}/api/categories`
  })
}

// Funcionalidad para tomar una categoría específica
export const getCategory = async (slug) => {
  return await axios({
    method: "GET",
    url: `${API}/api/category/${slug}`
  })
}

// Funcionalidad para borrar una categoría
export const deleteCategory = async (slug, token) => {
  return await axios({
    method: "DELETE",
    url: `${API}/api/category/${slug}`,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}