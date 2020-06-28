import axios from "axios";

export const registerSinester = (sinesterData) => dispatch => {
    const token = localStorage.getItem("jwtToken");
    const data = {
      token,
      sinesterData
    }

    console.log(data);
  
    return axios
      .post("/api/sinesters/save", data)
      .then(res => {
        return res;
      }).catch(err => {
        return err;
      });
  
  };