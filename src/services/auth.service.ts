import axios from 'axios';
import { toast } from '../utils/toast';
import { environments } from '../../environments/environments';

interface response {
    success: boolean,
    data: any,
}

export const registerUser = async (payload) => {
    try {
        const res: response = await axios.post(`${environments.apiUrl}/auth/register`, payload); 
        if (!res.data.success) {
            toast.error(res.data.error);
            return;
        }
        return res.data.data;
    } catch (error) {
        toast.error(error.message);
    }
}

export const loginUser = async (payload) => {
    try {
        const res: response = await axios.put(`${environments.apiUrl}/auth/login`, payload);
        if (!res.data.success) {
            toast.error(res.data.error);
            return;
        }
        return res.data.data;
    } catch (error) {
        toast.error(error.message);
    }
}