import axios from "axios";
import {API} from "../config";

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