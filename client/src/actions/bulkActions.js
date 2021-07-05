import axios from "axios";

const replaceKeys = (translationTable, dataEntry) => {
  const resultObj = {}
  Object.keys(dataEntry).forEach(key => {
    const translation = translationTable[key]
    resultObj[translation] = dataEntry[key]
  })
  return resultObj
}

export const bulkData = (bulkData, endPoint, translationTable) => dispatch => {
  const token = localStorage.getItem("jwtToken");


  const data = {
    token,
    bulkData,
    type: endPoint
  }

  console.log(endPoint);

  return axios
    .post(`/api/bulk/bulk`, data)
    .then(res => {
      return res;
    }).catch(err => {
      return err;
    });

};