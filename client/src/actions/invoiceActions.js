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

export const updateInvoice = (invoiceData) => dispatch => {
  const token = localStorage.getItem("jwtToken");
  delete invoiceData.client
  delete invoiceData.insurance
  const data = {
    token,
    invoiceData
  }

  return axios
    .post("/api/invoices/update", data)
    .then(res => {
      return res;
    }).catch(err => {
      return err;
    });
}

export const changeInvoiceStatus = (id, status) => dispatch => {
  const data = {
    id,
    status
  }

  return axios
    .post("/api/invoices/status", data)
    .then(res => {
      return res;
    }).catch(err => {
      return err;
    });
}

export const deleteInvoice = (id) => dispatch => {
  const token = localStorage.getItem("jwtToken");
  const data = {
    id,
    token
  }
  return axios
    .post("/api/invoices/delete", data)
    .then(res => {
      return res;
    }).catch(err => {
      return err;
    });

}