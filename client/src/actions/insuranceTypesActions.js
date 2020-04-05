import axios from "axios";

export const addCompanyToInsuranceType = (companyData, insuranceTypeId) => dispatch => {
  const token = localStorage.getItem("jwtToken");
  const data = {
    token,
    companyData
  }

  return axios
    .post(`/api/insuranceTypes/${insuranceTypeId}`, data)
    .then(res => {
      return res;
    }).catch(err => {
      return err;
    });

};


export const getInsuranceTypes = () => dispatch => {
  const token = localStorage.getItem("jwtToken");

  return axios
    .get("/api/insuranceTypes/fetch", { token })
    .then((res) => {
      return res.data
    }).catch(err => {
      return err;
    });
}

export const deleteCompanyFromInsuranceType = (insuranceTypeId, companyId) => dispatch => {
  const token = localStorage.getItem("jwtToken");
  const data = {
    id,
    token
  }
  return axios
    .post(`/api/insuranceTypes/${insuranceTypeId}/delete/${companyId}`, data)
    .then(res => {
      return res;
    }).catch(err => {
      return err;
    });

}