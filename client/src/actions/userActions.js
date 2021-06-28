import axios from "axios";

export const listUsers = () => dispatch => {
  const token = localStorage.getItem("jwtToken");
  const data = {
    token
  }

  return axios
    .post("/api/users/list", data)
    .then(res => {
      return res.data;
    });

};

export const listUsersByPermissions = () => dispatch => {
  return axios
    .get("/api/users/get_users_by_permissions")
    .then(res => {
      return res;
    });
};

export const setPermission = (user, insuranceType) => dispatch => {
  return axios
    .post("/api/users/assign_permission", { user, insuranceType })
    .then(res => {
      return res;
    });
};

export const removePermission = (user, insuranceType) => dispatch => {
  return axios
    .post("/api/users/remove_permission", { user, insuranceType })
    .then(res => {
      return res;
    });
};

