import {create} from "apisauce";
import base64 from "base-64";

// const port = process.env.PORT || 5000;
const apiClient = (username, password) => create(
    {
        // baseURL: `https://expense-tracker-tool.herokuapp.com`,
        // baseURL:process.env.baseURL || "http://127.0.0.1:5000",
        headers:{
            Authorization: "Basic " + base64.encode(username+":"+password)
    }
        
    }
);

export default apiClient