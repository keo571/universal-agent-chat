const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002';

export const queryAgent = async (query) => {
    try {
        const response = await fetch(`${API_URL}/api/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to query agent');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};


