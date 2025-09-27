import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button, Form, Input, Card, Typography, Divider, Alert } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import { signInWithEmail, signInWithGoogle } from '../../utils/supabase';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', content: string} | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for success message from reset password flow
    if (location.state?.message) {
      setMessage({
        type: 'success',
        content: location.state.message
      });
      
      // Clear the state to prevent showing the message again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      setLoading(true);
      const { error } = await signInWithEmail(values.email, values.password);
      
      if (error) throw error;
      
      setMessage({
        type: 'success',
        content: 'Logged in successfully!'
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      setMessage({
        type: 'error',
        content: error.error_description || error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      const { error } = await signInWithGoogle();
      
      if (error) throw error;
      
      setMessage({
        type: 'success',
        content: 'Logged in with Google successfully!'
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      setMessage({
        type: 'error',
        content: error.error_description || error.message
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: '#f0f2f5'
    }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
        {message && (
          <Alert
            message={message.type === 'success' ? 'Success' : 'Error'}
            description={message.content}
            type={message.type}
            showIcon
            style={{ marginBottom: 24 }}
            closable
            onClose={() => setMessage(null)}
          />
        )}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3}>Welcome Back</Title>
          <Text type="secondary">Sign in to continue to Interview.IO</Text>
        </div>

        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Password" size="large" />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
              size="large"
            >
              Sign In
            </Button>
            <div style={{ marginTop: 8, textAlign: 'right' }}>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
          </Form.Item>
        </Form>

        <Divider>OR</Divider>

        <Button
          icon={<GoogleOutlined />}
          onClick={handleGoogleLogin}
          loading={googleLoading}
          block
          size="large"
          style={{ marginBottom: 16 }}
        >
          Continue with Google
        </Button>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Text>Don't have an account? <Link to="/signup">Sign up</Link></Text>
        </div>
      </Card>
    </div>
  );
};

export default Login;
