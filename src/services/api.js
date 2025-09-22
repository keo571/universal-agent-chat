const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';

export const queryAgent = async (query) => {
    try {
        const response = await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: query,
                method: 'auto'
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to query agent');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const listDiagrams = async () => {
    try {
        const response = await fetch(`${API_URL}/diagrams`);
        if (!response.ok) {
            throw new Error('Failed to fetch diagrams');
        }
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};


