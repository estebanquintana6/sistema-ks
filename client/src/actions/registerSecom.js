import axios from "axios";
import swal from '@sweetalert/with-react';
import React from "react";

export const registerSecom = (secomData) => dispatch => {
  const token = localStorage.getItem("jwtToken");
  const data = {
    token,
    secomData
  }

  axios
    .post("/api/secom/save", data)
    .then(res => {
      swal({
        icon: "success",
        content: <h2>SECOM registrado!</h2>,
      });
    })
    .catch(err =>
      console.log(err)
    );
  };

export const getSecoms = () => dispatch => {
  const token = localStorage.getItem("jwtToken");

  return axios
    .post("/api/secom/fetch", {token})
    .then((res) => {
      return res.data
    })
}

export const deleteSecom = (id) => dispatch => {
  const token = localStorage.getItem("jwtToken");

  const data = {
    id,
    token
  }

  axios
    .post("/api/secom/delete", data)
    .then((res) => {
      return res
    })
}

export const makeClient = (id) => dispatch => {
  const token = localStorage.getItem("jwtToken");

  const data = {
    id,
    token
  }

  axios
    .post("/api/secom/makeClient", data)
    .then((res) => {
      return res
    })
}