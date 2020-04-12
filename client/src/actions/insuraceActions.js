import axios from "axios";

export const createInsurance = (insuranceData) => dispatch => {
  const token = localStorage.getItem("jwtToken");
  const data = {
    token,
    insuranceData
  }

  return axios
    .post(`/api/insurances/save`, data)
    .then(res => {
      return res;
    }).catch(err => {
      return err;
    });

};

export const getInsurances = (type) => dispatch => {
  const token = localStorage.getItem("jwtToken");

  return axios
    .get("/api/insurances/fetch/" + type, { token })
    .then((res) => {
      return res.data
    }).catch(err => {
      return err;
    });
}

export const updateInsurance = (insuranceData) => dispatch => {
  const token = localStorage.getItem("jwtToken");
  const data = {
    token,
    insuranceData
  }

  return axios
    .post("/api/insurances/update", data)
    .then(res => {
      return res;
    }).catch(err => {
      return err;
    });
}

export const deleteInsurance = (id) => dispatch => {
  const token = localStorage.getItem("jwtToken");
  const data = {
    id,
    token
  }
  return axios
    .post("/api/insurances/" + id + "/delete", data)
    .then(res => {
      return res;
    }).catch(err => {
      return err;
    });
}