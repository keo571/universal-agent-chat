import { useState, useCallback } from 'react';
import { queryAgent } from '../services/api';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(async (query) => {
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
      const result = await queryAgent(query);
      console.log('API result:', result); // Debug log


      const agentMessage = {
        id: Date.now() + 1,
        content: result.response, // Summary response
        explanation: result.explanation,
        results: result.results,
        visualization: result.visualization, // Chart config from backend
        visualization_path: result.visualization_path, // Legacy image support
        display_info: result.display_info, // Progressive disclosure info
        query_id: result.query_id, // For download functionality
        metadata: result.metadata, // Contains SQL and other metadata
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
  }, [loading]);

  return {
    messages,
    loading,
    sendMessage
  };
};