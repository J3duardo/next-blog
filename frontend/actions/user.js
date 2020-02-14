import axios from "axios";
import {API} from "../config";

export const getPublicUserProfile = async (username) => {
  return await axios({
    method: "GET",
    url: `${API}/api/user/${username}`,
    headers: {
      Accept: "application/json"
    }
  })
}