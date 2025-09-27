import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, Card, Typography, message } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { supabase } from '../../utils/supabase';

const { Title, Text } = Typography;

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: { email: string }) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      
      message.success('Password reset email sent! Please check your inbox.');
      setEmailSent(true);
    } catch (error: any) {
      message.error(error.error_description || error.message);
    } finally {
      setLoading(false);
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
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3}>Reset Password</Title>
          {emailSent ? (
            <Text type="secondary">
              We've sent you an email with instructions to reset your password.
            </Text>
          ) : (
            <Text type="secondary">
              Enter your email address and we'll send you a link to reset your password.
            </Text>
          )}
        </div>

        {!emailSent && (
          <Form
            name="forgotPassword"
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
              <Input 
                prefix={<MailOutlined />} 
                placeholder="Email" 
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
                Send Reset Link
              </Button>
            </Form.Item>
          </Form>
        )}

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

export default ForgotPassword;
