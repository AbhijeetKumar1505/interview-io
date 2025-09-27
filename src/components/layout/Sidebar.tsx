import React from 'react';
import { Layout, Menu, MenuProps } from 'antd';
import { 
  UserOutlined, 
  HomeOutlined,
  TeamOutlined,
  LogoutOutlined,
  ProfileOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { signOut } from '../../utils/supabase';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  onClick?: () => void,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    onClick,
  } as MenuItem;
}

const AppSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const items: MenuProps['items'] = [
    getItem('Dashboard', 'dashboard', <HomeOutlined />, () => navigate('/dashboard')),
    getItem('Interviewee', 'interviewee', <UserOutlined />, () => navigate('/interviewee')),
    getItem('Interviewer Dashboard', 'interviewer', <TeamOutlined />, () => navigate('/interviewer')),
    getItem('My Profile', 'profile', <ProfileOutlined />, () => navigate('/profile')),
    { type: 'divider', key: 'divider' },
    getItem('Logout', 'logout', <LogoutOutlined />, handleSignOut),
  ];

  if (!user) return null;

  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        boxShadow: '2px 0 8px 0 rgba(29, 35, 41, 0.05)'
      }}
      width={250}
    >
      <div style={{ 
        height: '64px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '0 16px'
      }}>
        <div style={{ 
          color: '#fff', 
          fontWeight: 'bold', 
          fontSize: '18px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          Interview.IO
        </div>
      </div>
      
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname.split('/')[1] || 'dashboard']}
        items={items}
        style={{ borderRight: 0 }}
      />
      
      <div style={{ 
        position: 'absolute', 
        bottom: 0, 
        width: '100%', 
        padding: '16px',
        color: 'rgba(255, 255, 255, 0.65)',
        textAlign: 'center',
        fontSize: '12px'
      }}>
        © {new Date().getFullYear()} Interview.IO
      </div>
    </Sider>
  );
};

export default AppSidebar;
