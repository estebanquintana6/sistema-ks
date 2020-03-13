import axios from "axios";

export const listUsers = () => dispatch => {
    const token = localStorage.getItem("jwtToken");
    const data = {
      token
    }
  
    return axios
      .post("/api/users/list", data)
      .then(res => {
        return res.data;
      });
    
};