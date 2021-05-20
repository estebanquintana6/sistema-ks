import axios from "axios";

export const changeRol = (id, role) => dispatch => {
    const token = localStorage.getItem("jwtToken");

    const data = {
        token,
        id,
        role
    }

    axios
      .post("/api/users/changeRol", data)
      .then((res) => {
        console.log(res);
        return res;
      })
  }

export const deleteUser = (id) => dispatch => {
  const token = localStorage.getItem("jwtToken");
  const data = {
    token,
    id
  }

  axios
    .post("/api/users/delete", data)
    .then((res) => {
    console.log(res);
    return res;
  })
}

export const activateUser = (id) => dispatch => {
  const data = {
    id
  }

  axios
    .post("/api/users/activate", data)
    .then((res) => {
    console.log(res);
    return res;
  })
}