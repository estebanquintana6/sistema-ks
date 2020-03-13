import axios from "axios";

export const getReferals = () => dispatch => {
    const token = localStorage.getItem("jwtToken");
    return axios
      .post("/api/clients/referals", {token})
      .then((res) => {
        return res.data
      })
  }