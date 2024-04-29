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

export const getFinishedMatches = async (params) => {
    try {
        const res: response = await axios.get(apiUrl + '/finished', { params });
        if(!res.data.success) {
            toast.error(res.data.error);
            return;
        }
        return res.data.data;
    } catch (error) {
        console.log(error);
    }
} 

export const getMatchDetails = async (params) => {
    try {
        console.log(params)
        const res: response = await axios.get(apiUrl + `/${params}`); 
        if(!res.data.success) {
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