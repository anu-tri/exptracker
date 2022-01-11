import apiClient from './clientBasicAuth';

const endpoint = "/token";

const getToken = async (username, password) => {
    let response = await apiClient(username,password).get(endpoint);
    let error, token = '';
    let current_userid = 0;
    if (!response.ok){error = "Unexpected error please Try again!"};
    if (response.status === 401){error = "Invalid Username/Password combo"};
    if (response.ok){token = response.data.token; current_userid = response.data.current_userid};
    return {"error":error, token, current_userid};
};

export default getToken;