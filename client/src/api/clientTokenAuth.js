import {create} from "apisauce";

// const port = process.env.PORT || 5000;

const apiClientWithToken = (token) => create(
    {
        
        // baseURL: `https://expense-tracker-tool.herokuapp.com`,
        baseURL:process.env.baseURL || "http://127.0.0.1:5000",
        headers:{
            Authorization: "Bearer " + token
        }
    }
);

export default apiClientWithToken