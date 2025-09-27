import { supabase } from '../utils/supabase';

export interface ProfileData {
  id: string;
  email?: string;
  full_name?: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
  updated_at?: string;
}

export const getProfile = async (userId: string): Promise<ProfileData | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

export const updateProfile = async (userId: string, updates: Partial<ProfileData>) => {
  console.log('updateProfile called with:', { userId, updates });
  
  try {
    // Only include fields that are in the allowed updates
    const allowedUpdates = ['full_name', 'phone', 'bio', 'avatar_url'];
    const updateData: Record<string, any> = { id: userId };

    // Only include fields that are in allowedUpdates and have a value
    Object.entries(updates).forEach(([key, value]) => {
      if (allowedUpdates.includes(key) && value !== undefined) {
        updateData[key] = value === '' ? null : value; // Convert empty strings to null
      }
    });

    updateData.updated_at = new Date().toISOString();
    
    console.log('Sending update to Supabase:', updateData);
    
    // First try the standard update method
    const { data, error } = await supabase
      .from('profiles')
      .upsert(updateData, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.warn('Standard update failed, trying alternative method...', error);
      
      // If standard update fails, try to create the profile if it doesn't exist
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (fetchError) {
        console.error('Error checking for existing profile:', fetchError);
        throw fetchError;
      }

      if (!existingProfile) {
        // If profile doesn't exist, create it with the updates
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{ 
            id: userId, 
            ...updateData,
            created_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          throw createError;
        }
        
        console.log('Profile created successfully:', newProfile);
        return { data: newProfile, error: null };
      } else {
        // If profile exists but update failed, try a direct update
        const { data: updatedProfile, error: updateError } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', userId)
          .select()
          .single();

        if (updateError) {
          console.error('Direct update failed:', updateError);
          throw updateError;
        }
        
        console.log('Direct update successful:', updatedProfile);
        return { data: updatedProfile, error: null };
      }
    }
    
    console.log('Profile update successful:', data);
    return { data, error: null };
  } catch (error) {
    console.error('Error in updateProfile:', {
      error,
      timestamp: new Date().toISOString(),
      userId,
      updates,
      errorString: String(error),
      errorObject: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : 'Not an Error instance'
    });
    
    // Return a more detailed error message
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { 
      data: null, 
      error: new Error(`Failed to update profile: ${errorMessage}`) 
    };
  }
};

export const uploadAvatar = async (userId: string, file: File) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // Update profile with new avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', userId);

    if (updateError) throw updateError;

    return { url: publicUrl, error: null };
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return { url: null, error };
  }
};

export const deleteAvatar = async (userId: string, avatarUrl: string) => {
  try {
    // Extract the file path from the URL
    const filePath = avatarUrl.split('/').pop();
    
    if (!filePath) throw new Error('Invalid avatar URL');

    // Delete file from storage
    const { error: deleteError } = await supabase.storage
      .from('avatars')
      .remove([filePath]);

    if (deleteError) throw deleteError;

    // Update profile to remove avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: null })
      .eq('id', userId);

    if (updateError) throw updateError;

    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting avatar:', error);
    return { success: false, error };
  }
};
