import axios from "axios";

export const createInsurance = (insuranceData, insuranceTypeId) => dispatch => {
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