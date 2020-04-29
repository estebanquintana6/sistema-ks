import axios from "axios";

export const getInvoices = () => dispatch => {
    const token = localStorage.getItem("jwtToken");
  
    return axios
      .get("/api/invoices/fetch", { token })
      .then((res) => {
        return res.data
      }).catch(err => {
        return err;
      });
  }
  