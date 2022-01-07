import {create} from "apisauce";

const apiClientWithToken = (token) => create(
    {
        baseURL: '',
        headers:{
            Authorization: "Bearer " + token
        }
    }
);

export default apiClientWithToken