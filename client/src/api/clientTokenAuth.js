import {create} from "apisauce";

const apiClientWithToken = (token) => create(
    {
        baseURL: 'https://expense-tracker-tool.herokuapp.com',
        headers:{
            Authorization: "Bearer " + token
        }
    }
);

export default apiClientWithToken