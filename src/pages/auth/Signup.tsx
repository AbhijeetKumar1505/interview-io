import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Form, Input, Card, Typography, Divider, message } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import { signUpWithEmail, signInWithGoogle } from '../../utils/supabase';

const { Title, Text } = Typography;

const Signup: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string; confirmPassword: string }) => {
    if (values.password !== values.confirmPassword) {
      message.error('Passwords do not match!');
      return;
    }

    try {
      setLoading(true);
      const { error } = await signUpWithEmail(values.email, values.password);
      
      if (error) throw error;
      
      message.success('Account created successfully! Please check your email to confirm your account.');
      navigate('/login');
    } catch (error: any) {
      message.error(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setGoogleLoading(true);
      const { error } = await signInWithGoogle();
      
      if (error) throw error;
      
      message.success('Signed up with Google successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      message.error(error.error_description || error.message);
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
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3}>Create an Account</Title>
          <Text type="secondary">Join Interview.IO today</Text>
        </div>

        <Form
          name="signup"
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
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters long!' }
            ]}
          >
            <Input.Password placeholder="Password" size="large" />
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
            <Input.Password placeholder="Confirm Password" size="large" />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
              size="large"
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        <Divider>OR</Divider>

        <Button
          icon={<GoogleOutlined />}
          onClick={handleGoogleSignup}
          loading={googleLoading}
          block
          size="large"
          style={{ marginBottom: 16 }}
        >
          Continue with Google
        </Button>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Text>Already have an account? <Link to="/login">Sign in</Link></Text>
        </div>
      </Card>
    </div>
  );
};

export default Signup;
