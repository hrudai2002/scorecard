import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { environments } from "../../environments/environments";

const api = axios.create({
    baseURL: environments.apiUrl
});

api.interceptors.request.use(
    async config => {
        const token = await AsyncStorage.getItem("@AuthData"); 
        config.headers.Authorization = `Bearer ${token}`; 
        return config
    }, 
    error => {
        return Promise.reject(error);
    }
)

api.interceptors.response.use(
    response => {
        return response
    }, 
    error => {
        const code = error && error.response ? error.response.status : 0
        if (code === 401 || code === 403) {
            console.log('error code', code)
        }
        return Promise.reject(error)
    }
)

export default api;