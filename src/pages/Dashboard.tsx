import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Typography } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from '../utils/supabase';
import { getProfile } from '../services/profileService';

const { Title, Text } = Typography;

interface UserProfile {
  full_name?: string;
  email?: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      
      try {
        const profileData = await getProfile(user.id);
        if (profileData) {
          setProfile({
            full_name: profileData.full_name,
            email: user.email
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2}>Dashboard</Title>
        <Button type="primary" danger onClick={handleLogout}>
          Logout
        </Button>
      </div>
      
      <Card loading={loading}>
        <Title level={4}>
          Welcome, {profile?.full_name || user?.email || 'User'}!
        </Title>
        <Text>You are now logged in to Interview.IO</Text>
        {profile?.full_name && (
          <Text style={{ display: 'block', marginTop: 8 }}>
            Email: {user?.email}
          </Text>
        )}
        
        <div style={{ marginTop: '24px' }}>
          <Button type="primary" onClick={() => navigate('/interviewee')} style={{ marginRight: '12px' }}>
            Go to Interviewee
          </Button>
          <Button onClick={() => navigate('/interviewer')}>
            Go to Interviewer Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
