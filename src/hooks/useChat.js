import { useState, useCallback } from 'react';
import { queryAgent } from '../services/api';

export const useChat = (queriedDiagrams, setQueriedDiagrams) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(async (query, diagramId) => {
    if (!query.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      content: query,
      timestamp: new Date().toISOString(),
      isUser: true
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const result = await queryAgent(query, diagramId || null);
      console.log('API result:', result); // Debug log

      // Track that this diagram has been queried
      const isFirstQuery = diagramId && !queriedDiagrams.has(diagramId);
      if (diagramId && isFirstQuery) {
        setQueriedDiagrams(prev => new Set([...prev, diagramId]));
      }

      const agentMessage = {
        id: Date.now() + 1,
        content: isFirstQuery ? result.response : '', // Hide summary for subsequent queries
        explanation: result.explanation,
        results: result.results,
        visualization_path: isFirstQuery ? result.visualization_path : null, // Hide image for subsequent queries
        visualization_data: isFirstQuery ? result.visualization_data : null, // Add JSON visualization data
        timestamp: new Date().toISOString(),
        isUser: false
      };

      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        content: `Error: ${error.message}`,
        timestamp: new Date().toISOString(),
        isUser: false,
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }, [loading, queriedDiagrams, setQueriedDiagrams]);

  return {
    messages,
    loading,
    sendMessage
  };
};