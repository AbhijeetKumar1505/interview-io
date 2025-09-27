import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Form, Input, Card, Typography, Alert } from 'antd';
import { LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { supabase } from '../../utils/supabase';

const { Title, Text } = Typography;

const ResetPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Check if we have an access token in the URL
  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');
  const type = searchParams.get('type');

  useEffect(() => {
    // If this is a password recovery flow, update the session
    if (type === 'recovery' && accessToken && refreshToken) {
      const updateSession = async () => {
        try {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          
          if (error) throw error;
          
          // Clear the URL parameters
          window.history.replaceState({}, document.title, '/reset-password');
        } catch (error: any) {
          setError(error.error_description || error.message);
        }
      };
      
      updateSession();
    }
  }, [accessToken, refreshToken, type]);

  const onFinish = async (values: { password: string; confirmPassword: string }) => {
    if (values.password !== values.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) throw error;
      
      setSuccess(true);
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login', { 
          state: { message: 'Password updated successfully! Please log in with your new password.' } 
        });
      }, 3000);
      
    } catch (error: any) {
      setError(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: '#f0f2f5'
      }}>
        <Card style={{ width: 400, textAlign: 'center' }}>
          <Title level={3} style={{ marginBottom: 16 }}>Password Updated!</Title>
          <Text>Your password has been updated successfully.</Text>
          <div style={{ marginTop: 24 }}>
            <Button 
              type="primary" 
              onClick={() => navigate('/login')}
            >
              Go to Login
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: '#f0f2f5'
    }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3}>Set New Password</Title>
          <Text type="secondary">
            Please enter your new password below.
          </Text>
        </div>

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 24 }}
            closable
            onClose={() => setError(null)}
          />
        )}

        <Form
          name="resetPassword"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input your new password!' },
              { min: 8, message: 'Password must be at least 8 characters long!' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="New Password" 
              size="large" 
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Confirm New Password" 
              size="large" 
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
              size="large"
            >
              Update Password
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button 
            type="link" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/login')}
          >
            Back to Login
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ResetPassword;
