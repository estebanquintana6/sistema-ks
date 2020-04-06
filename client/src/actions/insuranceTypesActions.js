import axios from "axios";

export const addCompanyToInsuranceType = (companyData, insuranceTypeId) => dispatch => {
  const token = localStorage.getItem("jwtToken");
  const data = {
    token,
    companyData
  }

  return axios
    .post(`/api/insurance_types/${insuranceTypeId}`, data)
    .then(res => {
      return res;
    }).catch(err => {
      return err;
    });

};


export const getInsuranceTypes = () => dispatch => {
  const token = localStorage.getItem("jwtToken");

  return axios
    .get("/api/insurance_types/fetch", { token })
    .then((res) => {
      return res.data
    }).catch(err => {
      return err;
    });
}

export const deleteCompanyFromInsuranceType = (insuranceTypeId, companyId) => dispatch => {
  const token = localStorage.getItem("jwtToken");
  return axios
    .post(`/api/insurance_types/${insuranceTypeId}/delete/${companyId}`, { token })
    .then(res => {
      return res;
    }).catch(err => {
      return err;
    });

}