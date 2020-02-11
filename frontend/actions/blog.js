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