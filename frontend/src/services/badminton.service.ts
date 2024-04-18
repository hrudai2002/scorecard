import axios from './fetcher';

const apiUrl = '/badminton';

export const getLiveMatches = async (params) => {
    try {
        const res = await axios.get(apiUrl + '/live', { params });
        return res.data.data;
    } catch (error) {
        console.log(error);
    }
}

export const createMatch = async (payload) => {
    try {
        const res = await axios.post(apiUrl + '/create', { payload }); 
    } catch (error) {
        console.log(error);
    }
}