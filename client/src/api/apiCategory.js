import apiClientWithToken from './clientTokenAuth'

const endpoint = '/category'

export const getCategories = async (token) =>{
    const response = await apiClientWithToken(token).get(endpoint)
    if (400 <= response.status && response.status < 500){return 400;}
    if (500 <= response.status && response.status < 600){return 500;}
    if (response.ok){return response.data.categories}
    return
}

export const postCategory = async(token, catName)=>{
    const response = await apiClientWithToken(token).post(endpoint,{name:catName});
    if (response.ok){return true}else{return false}
}

export const putCategory = async(token, id, catName)=>{
    const response = await apiClientWithToken(token).put(endpoint+'/'+id,{name:catName});
    if (response.ok){return true}else{return false}
}

export const deleteCategory = async (token, id)=>{
    const response = await apiClientWithToken(token).delete(endpoint+'/'+id);
    if (response.ok){return true}else{return false}
}