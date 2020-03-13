import axios from "axios";
import swal from '@sweetalert/with-react';
import React from "react";
import { GET_ERRORS} from "./types";


export const recoverPassword = (userData) => dispatch => {
    axios
    .post("/api/users/recover", userData)
    .then(res => {
      swal({
        content: <h4 style={{"margin-top": "10%"}}>Correo enviado a {userData.email}</h4>
      })
    }).catch(err => {
    swal({
        content: <h2>No existe cuenta asociada a este correo</h2>,
        });
    });
}

export const validateToken = (data) => dispatch => {
  return axios
  .post("/api/token/validate", data)
  .then(res => {
    return res;
  }).catch(err => {
    throw err;
  });
}

export const changePassword = (data) => dispatch => {  
  return axios
  .post("/api/users/changePassword", data)
  .then(res => {
    return res;
  }).catch(err => {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })
  });
}
