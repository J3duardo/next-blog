import axios from "axios";
import {API} from "../config";

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