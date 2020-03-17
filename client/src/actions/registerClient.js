import axios from "axios";
import swal from '@sweetalert/with-react';
import React from "react";


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


export const updateClient = (id, clientData) => dispatch => {
  const token = localStorage.getItem("jwtToken");
  const data = {
    id,
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