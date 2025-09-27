import React from 'react';
import { Layout } from 'antd';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const { Content } = Layout;

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout>
        <Header />
        <Content style={{ margin: '24px 16px 0' }}>
          <div style={{ padding: 24, minHeight: 360 }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
