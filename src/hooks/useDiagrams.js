import { useState, useEffect } from 'react';
import { listDiagrams } from '../services/api';

export const useDiagrams = () => {
  const [diagramId, setDiagramId] = useState('');
  const [availableDiagrams, setAvailableDiagrams] = useState([]);
  const [loadingDiagrams, setLoadingDiagrams] = useState(false);

  // Load available diagrams on mount
  useEffect(() => {
    const loadDiagrams = async () => {
      console.log('Loading diagrams...');
      setLoadingDiagrams(true);
      try {
        const diagrams = await listDiagrams();
        console.log('Loaded diagrams:', diagrams);
        setAvailableDiagrams(diagrams);
      } catch (error) {
        console.error('Failed to load diagrams:', error);
      } finally {
        setLoadingDiagrams(false);
      }
    };
    
    loadDiagrams();
  }, []);

  return {
    diagramId,
    setDiagramId,
    availableDiagrams,
    loadingDiagrams
  };
};