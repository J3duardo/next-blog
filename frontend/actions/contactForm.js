import axios from "axios";
// import {API} from "../config";
const API = process.env.NODE_ENV === "production" ? process.env.API : process.env.API_DEV;

export const contactAdmin = (mailData) => {
  return axios({
    method: "POST",
    url: `${API}/api/contact`,
    data: mailData,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  })
}

export const contactAuthor = (mailData) => {
  return axios({
    method: "POST",
    url: `${API}/api/contact-author`,
    data: mailData,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  })
}