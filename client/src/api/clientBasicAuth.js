import {create} from "apisauce";
import base64 from "base-64";

// const port = process.env.PORT || 5000;
const apiClient = (username, password) => create(
    {
        baseURL: `https://expense-tracker-tool.herokuapp.com`,
        headers:{
            Authorization: "Basic " + base64.encode(username+":"+password)
    }
        
    }
);

export default apiClient