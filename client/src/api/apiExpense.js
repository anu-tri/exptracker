import apiClientWithToken from './clientTokenAuth'

const endpoint = "/expense";

export const getExpenses = async (token) =>{
    //const response = await apiClientWithToken(token).get(endpoint)
    const response = await apiClientWithToken(token).get(endpoint)
    alert(response)
    if (400 <= response.status && response.status < 500){return 400;}
    if (500 <= response.status && response.status < 600){return 500;}
    if (response.ok){alert("okk");return response.data.expenses}
    return
}

export const getExpense = async (token,id)=>{
    const response = await apiClientWithToken(token).get(endpoint+'/'+id)
    if (400 <= response.status && response.status < 500){return 400;}
    if (500 <= response.status && response.status < 600){return 500;}
    if (response.ok){return response.data}
    return
}

export const getExpenseByMonth = async (token, month)=>{
    const response = await apiClientWithToken(token).get(endpoint+'/month/'+ month)
    if (400 <= response.status && response.status < 500){return 400;}
    if (500 <= response.status && response.status < 600){return 500;}
    if (response.ok){return response.data.expenses}
    return
}

export const getExpenseByCategory = async (token, id)=>{
    const response = await apiClientWithToken(token).get(endpoint+'/category/'+ id)
    if (400 <= response.status && response.status < 500){return 400;}
    if (500 <= response.status && response.status < 600){return 500;}
    if (response.ok){return response.data.expenses}
    return
}

export const postExpense = async (token, data)=>{
    const response= await apiClientWithToken(token).post(endpoint, data);
    if (response.ok){return true}else{return false}
}

export const putExpense = async (token, id, data)=>{
    const response= await apiClientWithToken(token).put(endpoint+"/"+id, data);
    if (response.ok){return true}else{return false}
}

export const deleteExpense = async (token, id)=>{
    const response= await apiClientWithToken(token).delete(endpoint+"/"+id);
    if (response.ok){return true}else{return false}
}
