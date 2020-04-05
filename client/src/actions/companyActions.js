import axios from "axios";

export const registerCompany = (companyData, history) => dispatch => {
  const token = localStorage.getItem("jwtToken");
  const data = {
    token,
    companyData
  }

  return axios
    .post("/api/companies/save", data)
    .then(res => {
      return res;
    }).catch(err => {
      return err;
    });

};


export const getCompaniess = () => dispatch => {
  const token = localStorage.getItem("jwtToken");

  return axios
    .get("/api/companies/fetch", { token })
    .then((res) => {
      return res.data
    }).catch(err => {
      return err;
    });
}


export const updateCompany = (companyData) => dispatch => {
  const token = localStorage.getItem("jwtToken");
  const data = {
    token,
    companyData
  }

  return axios
    .post("/api/companies/update", data)
    .then(res => {
      return res;
    }).catch(err => {
      return err;
    });
}

export const deleteCompany = (id) => dispatch => {
  const token = localStorage.getItem("jwtToken");
  const data = {
    id,
    token
  }
  return axios
    .post("/api/companies/delete", data)
    .then(res => {
      return res;
    }).catch(err => {
      return err;
    });

}