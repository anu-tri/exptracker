import {create} from "apisauce";

// const port = process.env.PORT || 5000;

const apiClientWithToken = (token) => create(
    {
        baseURL: window.location.hostname === 'localhost'||window.location.hostname==='127.0.0.1' ? "http://127.0.0.1:5000" : '',
        headers:{
            Authorization: "Bearer " + token
        }
    }
);

export default apiClientWithToken