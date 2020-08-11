import axios from "axios";

export const registerSinester = (sinesterData) => dispatch => {
    const token = localStorage.getItem("jwtToken");
    const data = {
      token,
      sinesterData
    }

    console.log(data);
  
    return axios
      .post("/api/sinesters/save", data)
      .then(res => {
        return res;
      }).catch(err => {
        return err;
      });
  
  };

export const getSinisters = (type) => dispatch => {
  return axios
    .get("/api/sinesters/fetch/" + type)
    .then((res) => {
      return res.data
    }).catch(err => {
      return err;
    });
}

export const updateSinester = (sinesterData) => dispatch => {
  const token = localStorage.getItem("jwtToken");
  const data = {
    token,
    sinesterData
  }

  return axios
    .post("/api/sinesters/update", data)
    .then(res => {
      return res;
    }).catch(err => {
      return err;
    });
}

export const deleteSinester = (id) => dispatch => {
  const token = localStorage.getItem("jwtToken");
  const data = {
    id,
    token
  }
  return axios
    .post("/api/sinesters/delete", data)
    .then(res => {
      return res;
    }).catch(err => {
      return err;
    });

}

export const download = (path) => dispatch => {
  const token = localStorage.getItem("jwtToken");
  const data = {
    token,
    path
  }
  return axios
    .post("/api/sinesters/download", data)
    .then(res => {
      return res;
    }).catch(err => {
      return err;
    });

}

export const removeFile = (path, id) => dispatch => {
  const token = localStorage.getItem("jwtToken");
  const data = {
    token,
    path,
    id
  }

  return axios
    .post("/api/sinesters/remove_file", data)
    .then(res => {
      return res;
    }).catch(err => {
      return err;
    });
}

export const saveFile = (fileData, id) => dispatch => {
  const token = localStorage.getItem("jwtToken");
  const data = {
    token,
    fileData,
    id,
  }

  return axios
    .post("/api/sinesters/save_file", data)
    .then(res => {
      return res;
    }).catch(err => {
      return err;
    });
}

export const getSinester = (id) => dispatch => {
  const token = localStorage.getItem("jwtToken");
  return axios
    .get("/api/sinesters/fetch/" + id, { token })
    .then((res) => {
      return res.data
    }).catch(err => {
      return err;
    });
}

export const getById = (id) => dispatch => {
  const token = localStorage.getItem("jwtToken");
  return axios
    .get("/api/sinesters/fetch_sinister/" + id, { token })
    .then((res) => {
      return res.data
    }).catch(err => {
      return err;
    });
}