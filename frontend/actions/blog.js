import axios from "axios";
import {API} from "../config";

// Crear un blog
export const createBlog = async (blogData, token) => {
  return await axios({
    method: "POST",
    url: `${API}/api/blog`,
    data: blogData,
    headers: {
      "Content-Type":'multipart/form-data',
      Authorization: `Bearer ${token}`
    }
  })
}

// Editar un blog
export const updateBlog = async (blogData, slug, token) => {
  return await axios({
    method: "PATCH",
    url: `${API}/api/blog/${slug}`,
    data: blogData,
    headers: {
      "Content-Type":'multipart/form-data',
      Authorization: `Bearer ${token}`
    }
  })
}

// Borrar un blog
export const deleteBlog = async (slug, token) => {
  return await axios({
    method: "DELETE",
    url: `${API}/api/blog/${slug}`,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
}

// Buscar todos los blogs
export const getAllBlogs = async () => {
  return await axios({
    method: "GET",
    url: `${API}/api/blogs`,
    headers: {
      "Content-Type": "application/json"
    }
  })
}

// Tomar todos los blogs con sus categorías
export const getBlogsWithCategoriesAndTags = async (limit, skip) => {
  return await axios({
    method: "POST",
    url: `${API}/api/blogs-categories-tags`,
    data: {
      limit,
      skip
    },
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
}

// Tomar un blog específico
export const getSingleBlog = async (slug) => {
  return await axios({
    method: "GET",
    url: `${API}/api/blog/${slug}`
  })
}

// Buscar los blogs relacionados
export const getRelatedBlogs = async (blogData) => {
  return await axios({
    method: "POST",
    url: `${API}/api/blogs/blogs-related`,
    data: {
      blogId: blogData.id,
      blogCategories: blogData.categories
    },
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
}