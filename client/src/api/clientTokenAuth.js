import {create} from "apisauce";

// const port = process.env.PORT || 5000;

const apiClientWithToken = (token) => create(
    {
        
        baseURL: `https://expense-tracker-tool.herokuapp.com`,
        headers:{
            Authorization: "Bearer " + token
        }
    }
);

export default apiClientWithToken