import axios from "axios";

export const registerClient = (clientData, history) => dispatch => {
  const token = localStorage.getItem("jwtToken");
  const data = {
    token,
    clientData
  }

  return axios
    .post("/api/clients/save", data)
    .then(res => {
      return res;
    }).catch(err => {
      return err;
    });

};


export const getClients = () => dispatch => {
  const token = localStorage.getItem("jwtToken");

  return axios
    .get("/api/clients/fetch", { token })
    .then((res) => {
      return res.data
    }).catch(err => {
      return err;
    });
}


export const updateClient = (clientData) => dispatch => {
  const token = localStorage.getItem("jwtToken");
  const data = {
    token,
    clientData
  }

  return axios
    .post("/api/clients/update", data)
    .then(res => {
      return res;
    }).catch(err => {
      return err;
    });
}

export const deleteClient = (id) => dispatch => {
  const token = localStorage.getItem("jwtToken");
  const data = {
    id,
    token
  }
  return axios
    .post("/api/clients/delete", data)
    .then(res => {
      return res;
    }).catch(err => {
      return err;
    });

}

export const download = (path) => dispatch => {
  console.log('PATHHH', path)
  const token = localStorage.getItem("jwtToken");
  const data = {
    token,
    path
  }
  return axios
    .post("/api/clients/download", data)
    .then(res => {
      return res;
    }).catch(err => {
      return err;
    });

}