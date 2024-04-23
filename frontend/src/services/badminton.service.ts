import axios from './fetcher';
import { toast } from '../utils/toast';

const apiUrl = '/badminton';


interface response {
    success: boolean, 
    data: any,
}

export const getLiveMatches = async (params) => {
    try {
        const res: response  = await axios.get(apiUrl + '/live', { params });
        if (!res.data.success) {
            toast.error(res.data.error);
            return;
        }
        return res.data.data;
    } catch (error) {
        console.log(error);
    }
}

export const createMatch = async (payload) => {
    try {
        const res: response = await axios.post(apiUrl + '/create', payload ); 
        if(!res.data.success) {
            toast.error(res.data.error);
            return;
        }
        return res.data.data;
    } catch (error) {
        console.log(error);
    }
}