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