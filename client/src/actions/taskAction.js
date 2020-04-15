import axios from "axios";

export const registerTask = (taskData) => dispatch => {
  const token = localStorage.getItem("jwtToken");
  const data = {
    token,
    taskData
  }

  return axios
    .post("/api/tasks/save", data)
    .then(res => {
      return res;
    }).catch(err => {
      return err;
    });

};


export const getTasks = () => dispatch => {
  const token = localStorage.getItem("jwtToken");

  return axios
    .get("/api/tasks/fetch", { token })
    .then((res) => {
      return res.data
    }).catch(err => {
      return err;
    });
}


export const updateTask = (taskData) => dispatch => {
  const token = localStorage.getItem("jwtToken");
  const data = {
    token,
    taskData
  }

  return axios
    .post("/api/tasks/update", data)
    .then(res => {
      return res;
    }).catch(err => {
      return err;
    });
}

export const deleteTask = (id) => dispatch => {
  const token = localStorage.getItem("jwtToken");
  const data = {
    id,
    token
  }
  return axios
    .post("/api/tasks/delete", data)
    .then(res => {
      return res;
    }).catch(err => {
      return err;
    });

}