import React from 'react';
import { Layout, Typography, Dropdown, MenuProps, Button, Avatar, Space } from 'antd';
import { UserOutlined, LogoutOutlined, DownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../../utils/supabase';
import { useAuth } from '../../contexts/AuthContext';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const AppHeader: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: 'Profile',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile')
    },
    {
      type: 'divider',
    },
    {
      key: '2',
      label: 'Sign Out',
      icon: <LogoutOutlined />,
      onClick: handleSignOut
    },
  ];

  return (
    <AntHeader style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      background: '#fff', 
      padding: '0 24px',
      boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)'
    }}>
      <div>
        <Text strong style={{ fontSize: '18px' }}>Interview.IO</Text>
      </div>
      
      {user && (
        <Dropdown menu={{ items }} trigger={['click']}>
          <Button type="text" style={{ height: '64px' }}>
            <Space>
              <Avatar 
                icon={<UserOutlined />} 
                src={user.user_metadata?.avatar_url}
                style={{ backgroundColor: '#1890ff' }}
              />
              <Text>{user.email}</Text>
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
      )}
    </AntHeader>
  );
};

export default AppHeader;
