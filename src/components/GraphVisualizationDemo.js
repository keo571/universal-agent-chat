import React, { useState } from 'react';
import GraphVisualization from './GraphVisualization';

// Demo component to test graph visualization with sample data
const GraphVisualizationDemo = () => {
  const [selectedExample, setSelectedExample] = useState('network');

  const examples = {
    network: {
      name: 'Network Topology',
      data: {
        visualization_type: 'network_graph',
        nodes: [
          { id: 'internet', label: 'Internet', type: 'Network', color: '#666', shape: 'hexagon', size: 40 },
          { id: 'fw1', label: 'Firewall', type: 'Firewall', color: '#D0021B', shape: 'triangle', size: 30 },
          { id: 'lb1', label: 'Load Balancer', type: 'LoadBalancer', color: '#F5A623', shape: 'diamond', size: 35 },
          { id: 'web1', label: 'Web Server 1', type: 'Server', color: '#4A90E2', shape: 'box', size: 25 },
          { id: 'web2', label: 'Web Server 2', type: 'Server', color: '#4A90E2', shape: 'box', size: 25 },
          { id: 'app1', label: 'App Server', type: 'Server', color: '#4A90E2', shape: 'box', size: 25 },
          { id: 'db1', label: 'Primary DB', type: 'Database', color: '#50E3C2', shape: 'cylinder', size: 30 },
          { id: 'db2', label: 'Replica DB', type: 'Database', color: '#50E3C2', shape: 'cylinder', size: 25 }
        ],
        edges: [
          { source: 'internet', target: 'fw1', type: 'CONNECTS_TO', label: 'ingress', color: '#333' },
          { source: 'fw1', target: 'lb1', type: 'PROTECTS', label: 'filters', color: '#D0021B', style: 'dashed' },
          { source: 'lb1', target: 'web1', type: 'ROUTES_TO', label: 'distributes', color: '#7ED321' },
          { source: 'lb1', target: 'web2', type: 'ROUTES_TO', label: 'distributes', color: '#7ED321' },
          { source: 'web1', target: 'app1', type: 'CONNECTS_TO', label: 'requests', color: '#333' },
          { source: 'web2', target: 'app1', type: 'CONNECTS_TO', label: 'requests', color: '#333' },
          { source: 'app1', target: 'db1', type: 'CONNECTS_TO', label: 'queries', color: '#333' },
          { source: 'db1', target: 'db2', type: 'REPLICATES_TO', label: 'syncs', color: '#50E3C2', style: 'dotted' }
        ],
        metadata: { diagram_id: 'network_demo', node_count: 8, edge_count: 8 }
      }
    },
    flowchart: {
      name: 'Business Process',
      data: {
        visualization_type: 'network_graph',
        nodes: [
          { id: 'start', label: 'Start', type: 'Process', color: '#4A90E2', shape: 'circle', size: 20 },
          { id: 'input', label: 'Receive Request', type: 'Process', color: '#4A90E2', shape: 'box', size: 30 },
          { id: 'validate', label: 'Validate Data', type: 'Process', color: '#4A90E2', shape: 'box', size: 30 },
          { id: 'check', label: 'Approval Required?', type: 'Decision', color: '#F5A623', shape: 'diamond', size: 35 },
          { id: 'approve', label: 'Get Approval', type: 'Process', color: '#4A90E2', shape: 'box', size: 30 },
          { id: 'process', label: 'Process Request', type: 'Process', color: '#4A90E2', shape: 'box', size: 30 },
          { id: 'store', label: 'Store in DB', type: 'DataStore', color: '#50E3C2', shape: 'cylinder', size: 30 },
          { id: 'notify', label: 'Send Notification', type: 'Process', color: '#4A90E2', shape: 'box', size: 30 },
          { id: 'end', label: 'End', type: 'Process', color: '#4A90E2', shape: 'circle', size: 20 }
        ],
        edges: [
          { source: 'start', target: 'input', type: 'FLOWS_TO', label: '', color: '#4A90E2' },
          { source: 'input', target: 'validate', type: 'FLOWS_TO', label: '', color: '#4A90E2' },
          { source: 'validate', target: 'check', type: 'FLOWS_TO', label: '', color: '#4A90E2' },
          { source: 'check', target: 'approve', type: 'FLOWS_TO', label: 'Yes', color: '#F5A623' },
          { source: 'check', target: 'process', type: 'FLOWS_TO', label: 'No', color: '#F5A623' },
          { source: 'approve', target: 'process', type: 'FLOWS_TO', label: '', color: '#4A90E2' },
          { source: 'process', target: 'store', type: 'STORES_IN', label: 'save', color: '#50E3C2', style: 'dotted' },
          { source: 'process', target: 'notify', type: 'FLOWS_TO', label: '', color: '#4A90E2' },
          { source: 'notify', target: 'end', type: 'FLOWS_TO', label: '', color: '#4A90E2' }
        ],
        metadata: { diagram_id: 'flowchart_demo', node_count: 9, edge_count: 9 }
      }
    },
    minimal: {
      name: 'Minimal Example',
      data: {
        visualization_type: 'network_graph',
        nodes: [
          { id: 'a', label: 'Node A', type: 'default', color: '#4A90E2', shape: 'circle', size: 20 },
          { id: 'b', label: 'Node B', type: 'default', color: '#50E3C2', shape: 'box', size: 25 },
          { id: 'c', label: 'Node C', type: 'default', color: '#F5A623', shape: 'diamond', size: 30 }
        ],
        edges: [
          { source: 'a', target: 'b', type: 'CONNECTS_TO', label: 'connects', color: '#333' },
          { source: 'b', target: 'c', type: 'FLOWS_TO', label: 'flows', color: '#4A90E2' },
          { source: 'c', target: 'a', type: 'RETURNS_TO', label: 'returns', color: '#7ED321', style: 'dashed' }
        ],
        metadata: { diagram_id: 'minimal_demo', node_count: 3, edge_count: 3 }
      }
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Graph Visualization Demo</h1>
      <p>Test the graph visualization component with different example datasets:</p>
      
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="example-select">Choose an example: </label>
        <select 
          id="example-select"
          value={selectedExample} 
          onChange={(e) => setSelectedExample(e.target.value)}
          style={{ 
            padding: '5px 10px', 
            fontSize: '14px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        >
          {Object.entries(examples).map(([key, example]) => (
            <option key={key} value={key}>{example.name}</option>
          ))}
        </select>
      </div>

      <div style={{ 
        border: '2px solid #e0e0e0', 
        borderRadius: '8px', 
        padding: '10px',
        backgroundColor: '#f9f9f9'
      }}>
        <h2>{examples[selectedExample].name}</h2>
        <GraphVisualization 
          visualizationData={examples[selectedExample].data}
          width={800}
          height={400}
        />
      </div>

      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#f0f0f0', 
        borderRadius: '8px' 
      }}>
        <h3>Data Structure Preview:</h3>
        <pre style={{ 
          backgroundColor: 'white', 
          padding: '10px', 
          borderRadius: '4px',
          overflow: 'auto',
          maxHeight: '300px',
          fontSize: '12px'
        }}>
          {JSON.stringify(examples[selectedExample].data, null, 2)}
        </pre>
      </div>

      <div style={{ marginTop: '20px', color: '#666' }}>
        <h3>Features:</h3>
        <ul>
          <li>Interactive force-directed graph layout</li>
          <li>Custom node shapes based on type (box, diamond, cylinder, etc.)</li>
          <li>Color-coded nodes and edges</li>
          <li>Edge styles (solid, dashed, dotted)</li>
          <li>Pan, zoom, and drag capabilities</li>
          <li>Click nodes to see properties</li>
          <li>Fit to view and center controls</li>
        </ul>
      </div>
    </div>
  );
};

export default GraphVisualizationDemo;