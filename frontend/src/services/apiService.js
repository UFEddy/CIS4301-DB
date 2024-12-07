import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const fetchQuery2Results = async (seasonYear) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/query2`, { seasonYear });
        return response.data;
    } catch (error) {
        console.error('Error fetching Query 2 results:', error);
        throw error;
    }
};