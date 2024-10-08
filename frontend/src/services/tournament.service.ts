import axios from "./fetcher";
import { toast } from "../utils/toast";

interface response {
    success: boolean,
    data: any,
}

const apiUrl = '/tournament'; 

export const getAllTournaments = async (params) => {
    try {
        const res: response = await axios.get(apiUrl, {params}); 
        if(!res.data.success) {
            toast.error(res.data.error);
            return;
        }
        return res.data.data;
    } catch (error) {
        toast.error('Something went wrong, while fetching tournaments data!');
    }
}

export const getTournamentMatches = async (params, id) => {
    try {
        const res: response = await axios.get(`${apiUrl}/${id}`, {params});
        if(!res.data.success) {
            toast.error(res.data.error);
            return;
        }
        return res.data.data;
    } catch (error) {
        toast.error('Something went wrong, while fetching tournament matches');
    }
}

export const createTournament = async (payload) => {
    try {
        const res: response = await axios.post(apiUrl + '/create', payload);
        if(!res.data.success) {
            toast.error(res.data.error); 
            return;
        }
        return res.data.data;
    } catch (error) {
        toast.error('Something went wrong, while creating tournament!');
    }
}

export const moveMatchToLive = async (payload) => {
    try {
        const res: response = await axios.put(apiUrl + '/movetolive', payload);
        if (!res.data.success) {
            toast.error(res.data.error);
            return;
        }
        return res.data.data;
    } catch (error) {
        toast.error('Something went wrong, while moving match to live!');
    }
}



