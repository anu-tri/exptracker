import {create} from "apisauce";
import base64 from "base-64";

// const port = process.env.PORT || 5000;
const apiClient = (username, password) => create(
    {
        baseURL: window.location.hostname === 'localhost'|| window.location.hostname ==='127.0.0.1' ? "https://expense-tracker-tool.herokuapp.com" : 'https://expense-tracker-tool.herokuapp.com',
        headers:{
            Authorization: "Basic " + base64.encode(username+":"+password)
        }
        
    }
);

export default apiClient