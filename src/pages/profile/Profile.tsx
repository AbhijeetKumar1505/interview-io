import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Form, Input, Upload, message, Card, Avatar, Typography } from 'antd';
import { UserOutlined, CameraOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadChangeParam, UploadFile } from 'antd/es/upload';
import type { RcFile } from 'antd/es/upload/interface';
import { getProfile, updateProfile, uploadAvatar, deleteAvatar, ProfileData } from '../../services/profileService';

const { Title } = Typography;

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [, setProfile] = useState<ProfileData | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  const loadProfile = React.useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const profileData = await getProfile(user.id);
      
      if (profileData) {
        setProfile(profileData);
        form.setFieldsValue({
          full_name: profileData.full_name || '',
          phone: profileData.phone || '',
          bio: profileData.bio || ''
        });
        if (profileData.avatar_url) setAvatarUrl(profileData.avatar_url);
      }
    } catch (error: any) {
      console.error('Error loading profile:', error.message);
      message.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [user?.id, form]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSubmit = async (values: any) => {
    if (!user?.id) {
      console.error('No user ID available');
      message.error('User not authenticated');
      return;
    }
    
    try {
      console.log('Starting profile update with values:', {
        userId: user.id,
        updates: {
          full_name: values.full_name,
          phone: values.phone,
          bio: values.bio,
          avatar_url: avatarUrl
        }
      });
      
      setLoading(true);
      
      // Create the update object with only the fields that have values
      const updates: Partial<ProfileData> = {
        full_name: values.full_name?.trim(),
        phone: values.phone?.trim() || null,
        bio: values.bio?.trim() || null,
      };
      
      // Only include avatar_url if it exists
      if (avatarUrl) {
        updates.avatar_url = avatarUrl;
      }
      
      console.log('Sending updates to server:', updates);
      
      const { data, error } = await updateProfile(user.id, updates);

      console.log('Update response:', { data, error });

      if (error) {
        console.error('Error from updateProfile:', error);
        const errorMessage = typeof error === 'object' && error !== null && 'message' in error 
          ? String(error.message) 
          : 'Failed to update profile';
        throw new Error(errorMessage);
      }
      
      if (data) {
        console.log('Profile update successful:', data);
        // Update the local state with the new data
        setProfile(prev => ({
          ...prev,
          ...data,
          id: user.id
        }));
        
        // Update form fields with the returned data to ensure consistency
        form.setFieldsValue({
          full_name: data.full_name || '',
          phone: data.phone || '',
          bio: data.bio || ''
        });
        
        message.success('Profile updated successfully!');
      } else {
        console.warn('No data returned from updateProfile');
        throw new Error('No data returned from server');
      }
    } catch (error: any) {
      console.error('Error in handleSubmit:', {
        message: error.message,
        error: error,
        stack: error.stack
      });
      message.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (info: UploadChangeParam<UploadFile>) => {
    if (!info.file || !user?.id) return;
    
    try {
      setUploading(true);
      const file = info.file.originFileObj as File;
      const { url, error } = await uploadAvatar(user.id, file);
      
      if (error) throw error;
      if (url) {
        setAvatarUrl(url);
        message.success('Avatar updated successfully!');
      }
    } catch (error: any) {
      console.error('Error uploading avatar:', error.message);
      message.error('Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };
  
  const handleDeleteAvatar = async () => {
    if (!user?.id || !avatarUrl) return;
    
    try {
      setUploading(true);
      const { error } = await deleteAvatar(user.id, avatarUrl);
      
      if (error) throw error;
      
      setAvatarUrl('');
      message.success('Avatar removed successfully!');
    } catch (error: any) {
      console.error('Error deleting avatar:', error.message);
      message.error('Failed to remove avatar');
    } finally {
      setUploading(false);
    }
  };

  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
    }
    return isImage && isLt2M;
  };

  return (
    <div className="profile-page" style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
      <Card loading={loading}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Upload
              name="avatar"
              listType="picture-circle"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleAvatarChange}
              disabled={uploading}
            >
              {avatarUrl ? (
                <Avatar 
                  size={100} 
                  src={avatarUrl} 
                  icon={<UserOutlined />} 
                  style={{ fontSize: '40px' }}
                />
              ) : (
                <div>
                  {uploading ? (
                    <div style={{ marginTop: 20 }}>Uploading...</div>
                  ) : (
                    <div>
                      <CameraOutlined style={{ fontSize: 20 }} />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </div>
              )}
            </Upload>
            {avatarUrl && (
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={handleDeleteAvatar}
                loading={uploading}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  transform: 'translate(50%, 50%)',
                  zIndex: 1,
                }}
              />
            )}
          </div>
          <Title level={3} style={{ marginTop: 16 }}>
            {user?.email}
          </Title>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ remember: true }}
        >
          <Form.Item
            label="Full Name"
            name="full_name"
            rules={[{ required: true, message: 'Please input your full name!' }]}
          >
            <Input placeholder="Enter your full name" />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[
              { pattern: /^[0-9+\-\s]*$/, message: 'Please enter a valid phone number!' }
            ]}
          >
            <Input placeholder="Enter your phone number" />
          </Form.Item>

          <Form.Item
            label="Bio"
            name="bio"
          >
            <Input.TextArea rows={4} placeholder="Tell us about yourself..." />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{ width: '100%' }}
            >
              Update Profile
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Profile;
