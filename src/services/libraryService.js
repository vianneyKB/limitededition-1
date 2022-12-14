import { apiGet, apiPost } from '../utils/axiosConfig'

export async function getTypes() {
    return apiGet(`/getType`, { params: {} }).then((data) => data.data);
}

export async function getAllModels() {
    return apiGet(`/getAllModel`, { params: {} }).then((data) => data.data);
}

export async function postNewModel(data) {
    return apiPost(`/addModel`, { data: data }).then((rs) => rs.data);
  }