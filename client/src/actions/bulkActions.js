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
  const resultArray = bulkData.map(data => replaceKeys(translationTable, data)).slice(0, 100);
  const data = {
    token,
    bulkData: resultArray
  }


  return axios
    .post(`/api/${endPoint}/bulk`, data)
    .then(res => {
      return res;
    }).catch(err => {
      return err;
    });

};