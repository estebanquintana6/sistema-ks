import axios from "axios";

export const getEmails = () => dispatch => {
    return axios
        .get("/api/emails/fetch")
        .then((res) => {
            return res.data
        }).catch(err => {
            return err;
        });
}

export const updateEmail = (email) => dispatch => {
    return axios
        .post("/api/emails/update", { email })
        .then((res) => {
            return res
        }).catch(err => {
            return err;
        });
}
