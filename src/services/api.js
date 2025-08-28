const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const queryAgent = async (query, diagramId = null) => {
    try {
        const response = await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: query,
                diagram_id: diagramId || '',
                method: 'auto',
                explanation_detail: 'basic'
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


