import axios from "axios";
import {API} from "../config";

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