import React from 'react';
import { render, screen } from '@testing-library/react';
import GraphVisualization from './GraphVisualization';

// Sample test data matching the format from netbot-v2
const sampleVisualizationData = {
  visualization_type: 'network_graph',
  nodes: [
    {
      id: 'server1',
      label: 'Web Server',
      type: 'Server',
      color: '#4A90E2',
      shape: 'box',
      size: 30,
      properties: {
        ip: '192.168.1.10',
        port: '443',
        status: 'active'
      }
    },
    {
      id: 'lb1',
      label: 'Load Balancer',
      type: 'LoadBalancer',
      color: '#F5A623',
      shape: 'diamond',
      size: 40,
      properties: {
        algorithm: 'round-robin',
        health_check: 'enabled'
      }
    },
    {
      id: 'db1',
      label: 'Database',
      type: 'Database',
      color: '#50E3C2',
      shape: 'cylinder',
      size: 35,
      properties: {
        type: 'PostgreSQL',
        version: '14.5',
        replicas: 3
      }
    },
    {
      id: 'fw1',
      label: 'Firewall',
      type: 'Firewall',
      color: '#D0021B',
      shape: 'triangle',
      size: 25,
      properties: {
        rules: 45,
        mode: 'strict'
      }
    }
  ],
  edges: [
    {
      source: 'fw1',
      target: 'lb1',
      type: 'PROTECTS',
      label: 'protects',
      color: '#D0021B',
      style: 'dashed',
      properties: {
        protocol: 'HTTPS',
        port: 443
      }
    },
    {
      source: 'lb1',
      target: 'server1',
      type: 'ROUTES_TO',
      label: 'routes',
      color: '#7ED321',
      style: 'solid',
      properties: {
        load: '45%'
      }
    },
    {
      source: 'server1',
      target: 'db1',
      type: 'CONNECTS_TO',
      label: 'queries',
      color: '#333333',
      style: 'solid',
      properties: {
        connection_pool: 20
      }
    }
  ],
  metadata: {
    diagram_id: 'test_diagram',
    node_count: 4,
    edge_count: 3,
    layout_hint: 'force_directed'
  }
};

describe('GraphVisualization', () => {
  test('renders without crashing', () => {
    render(<GraphVisualization visualizationData={sampleVisualizationData} />);
  });

  test('displays node and edge counts', () => {
    render(<GraphVisualization visualizationData={sampleVisualizationData} />);
    expect(screen.getByText('Nodes: 4')).toBeInTheDocument();
    expect(screen.getByText('Edges: 3')).toBeInTheDocument();
  });

  test('renders control buttons', () => {
    render(<GraphVisualization visualizationData={sampleVisualizationData} />);
    expect(screen.getByText('Fit to View')).toBeInTheDocument();
    expect(screen.getByText('Center')).toBeInTheDocument();
  });

  test('shows empty state when no data', () => {
    render(<GraphVisualization visualizationData={null} />);
    expect(screen.getByText('No graph data to visualize')).toBeInTheDocument();
  });

  test('handles empty nodes and edges arrays', () => {
    const emptyData = {
      visualization_type: 'network_graph',
      nodes: [],
      edges: [],
      metadata: {}
    };
    render(<GraphVisualization visualizationData={emptyData} />);
    expect(screen.getByText('No graph data to visualize')).toBeInTheDocument();
  });
});