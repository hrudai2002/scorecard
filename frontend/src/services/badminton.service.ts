import axios from './fetcher';
import { toast } from '../utils/toast';

interface response {
    success: boolean, 
    data: any,
}

const apiUrl = '/badminton';

export const getLiveMatches = async (params) => {
    try {
        const res: response  = await axios.get(apiUrl + '/live', { params });
        if (!res.data.success) {
            toast.error(res.data.error);
            return;
        }
        return res.data.data;
    } catch (error) {
        toast.error('Something went wrong!');
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
        toast.error('Something went wrong!');
    }
} 

export const getMatchDetails = async (params) => {
    try {
        const res: response = await axios.get(apiUrl + `/${params}`); 
        if(!res.data.success) {
            toast.error(res.data.error); 
            return;
        }
        return res.data.data;
    } catch (error) {
        toast.error('Something went wrong!');
    }
}

export const getMatchSummary = async (params) => {
    try {
        const res: response = await axios.get(apiUrl + `/summary/${params}`);
        if (!res.data.success) {
            toast.error(res.data.error);
            return;
        }
        return res.data.data;
    } catch (error) {
        console.log(error);
        toast.error('Something went wrong!');
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
        toast.error('Something went wrong!');
    }
}

export const updateScore = async (payload) => {
    try {
        console.log(payload);
        const res: response = await axios.put(apiUrl + '/update/score', payload ); 
        if(!res.data.success) {
            toast.error(res.data.error);
            return false;
        }
        return true;
    } catch (error) {
        toast.error('Something went wrong!');
    }
}