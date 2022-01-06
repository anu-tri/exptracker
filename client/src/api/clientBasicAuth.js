import {create} from "apisauce";
import base64 from "base-64";

const apiClient = (username, password) => create(
    {
        baseURL: window.location.hostname === 'localhost'|| window.location.hostname === '127.0.0.1' ? "http://127.0.0.1:5000" : '',
        headers:{
            Authorization: "Basic " + base64.encode(username+":"+password)
    }
        
    }
);

export default apiClient