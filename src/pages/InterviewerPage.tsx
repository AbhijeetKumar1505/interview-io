import React from 'react';
import { Card, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

interface CandidateType {
  key: string;
  name: string;
  email: string;
  score: number;
  status: 'completed' | 'in-progress' | 'not-started';
}

const columns: ColumnsType<CandidateType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Score',
    dataIndex: 'score',
    key: 'score',
    render: (score: number) => score || 'N/A',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      const statusMap: Record<string, string> = {
        'completed': 'Completed',
        'in-progress': 'In Progress',
        'not-started': 'Not Started'
      };
      return statusMap[status] || status;
    },
  },
];

const InterviewerPage: React.FC = () => {
  // This will be replaced with actual data from the store
  const data: CandidateType[] = [
    // Sample data - will be replaced with actual data
    {
      key: '1',
      name: 'John Doe',
      email: 'john@example.com',
      score: 85,
      status: 'completed',
    },
  ];

  return (
    <div>
      <Title level={2}>Candidate Dashboard</Title>
      <Card>
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="key"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default InterviewerPage;
