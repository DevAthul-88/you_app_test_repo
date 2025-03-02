import React, { useState, useRef, useEffect } from 'react';
import { Pencil, Plus } from 'lucide-react';
import { authApi } from '@/lib/api';
import { Profile } from '@/types/auth';
import { calculateHoroscope, calculateZodiac } from '@/lib/zodiac';
import ProfileDetails from './ProfileDetails';
import toast from 'react-hot-toast';

interface ProfileSectionProps {
  onProfileUpdate: (profile: Profile) => void;
  onImageSelect?: (imageUrl: string) => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ onProfileUpdate, onImageSelect }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<Profile>>({
    name: '',
    gender: 'Male',
    birthday: '',
    height: undefined,
    weight: undefined,
    interests: [],
    zodiac: '',
    horoscope: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setFormData({ ...profile });
    }
  }, [profile]);

  const fetchProfile = async () => {
    try {
      const response = await authApi.getProfile();
      if (response) {
        const profileData = response;
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setImage(imageUrl);
        onImageSelect?.(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const zodiac = formData.birthday ? calculateZodiac(formData.birthday) : '';
      const horoscope = formData.birthday ? calculateHoroscope(formData.birthday) : '';

      const data: Partial<Profile> = {
        ...formData,
        height: formData.height ? Number(formData.height) : undefined,
        weight: formData.weight ? Number(formData.weight) : undefined,
        zodiac,
        horoscope,
      };

      const response = profile 
        ? await authApi.updateProfile(data)
        : await authApi.createProfile(data);

      const updatedProfile = response.data || response;

      if (updatedProfile) {
        const user = await authApi.getProfile();
        user.gender = formData?.gender || "Male";
        onProfileUpdate(user);
        setProfile(user);
        setIsEditing(false);
        toast.success('Profile updated');
      } else {
        toast.error('Something went wrong please try again later');
      }
    } catch (error) {
      toast.error('Something went wrong please try again later');
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let updatedData = { ...formData };

    if (name === 'birthday') {
      updatedData.zodiac = calculateZodiac(value);
      updatedData.horoscope = calculateHoroscope(value);
    }

    updatedData[name as keyof Profile] = value as any;
    setFormData(updatedData);
  };

  return (
    <div className="bg-[#162329] p-5 rounded-2xl mb-4">

      <div className="flex justify-between items-start">
        <h3 className="text-base font-medium text-white">About</h3>
        {!isEditing ? (
          <button className="mt-1 p-1" onClick={() => setIsEditing(true)}>
            <Pencil className="w-[18px] h-[18px] text-gray-400" />
          </button>
        ) : (
          <button
            className="text-blue-400 text-sm disabled:opacity-50"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save & Update'}
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="mt-6">
          <div className="mb-6 flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center w-16 h-16 bg-[#1e2a32] rounded-lg hover:bg-[#252f35] transition-colors"
            >
              <Plus className="w-6 h-6 text-gray-400" />
            </button>
            <h5 className="text-sm text-white ml-1 cursor-pointer" onClick={() => fileInputRef.current?.click()}>Add image</h5>
          </div>

          <div className="grid gap-3">
            <div className="grid grid-cols-[100px_1fr] items-center">
              <label className="text-gray-400 text-sm">Display name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className="w-full bg-[#1e2a32] text-white p-2 rounded-lg focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-[100px_1fr] items-center">
              <label className="text-gray-400 text-sm">Gender</label>
              <select
                name="gender"
                value={formData.gender || ''}
                onChange={handleChange}
                className="w-full bg-[#1e2a32] text-white p-2 rounded-lg focus:outline-none appearance-none"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="grid grid-cols-[100px_1fr] items-center">
              <label className="text-gray-400 text-sm">Birthday</label>
              <input
                type="date"
                name="birthday"
                value={formData.birthday || ''}
                onChange={handleChange}
                className="w-full bg-[#1e2a32] text-white p-2 rounded-lg focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-[100px_1fr] items-center">
              <label className="text-gray-400 text-sm">Horoscope</label>
              <input
                type="text"
                value={formData.horoscope || ''}
                disabled
                className="w-full bg-[#1e2a32] text-white p-2 rounded-lg focus:outline-none cursor-not-allowed opacity-70"
              />
            </div>

            <div className="grid grid-cols-[100px_1fr] items-center">
              <label className="text-gray-400 text-sm">Zodiac</label>
              <input
                type="text"
                value={formData.zodiac || ''}
                disabled
                className="w-full bg-[#1e2a32] text-white p-2 rounded-lg focus:outline-none cursor-not-allowed opacity-70"
              />
            </div>

            <div className="grid grid-cols-[100px_1fr] items-center">
              <label className="text-gray-400 text-sm">Height</label>
              <input
                type="number"
                name="height"
                value={formData.height || ''}
                onChange={handleChange}
                className="w-full bg-[#1e2a32] text-white p-2 rounded-lg focus:outline-none"
                placeholder="Height in cm"
              />
            </div>

            <div className="grid grid-cols-[100px_1fr] items-center">
              <label className="text-gray-400 text-sm">Weight</label>
              <input
                type="number"
                name="weight"
                value={formData.weight || ''}
                onChange={handleChange}
                className="w-full bg-[#1e2a32] text-white p-2 rounded-lg focus:outline-none"
                placeholder="Weight in kg"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button className='mt-4 text-red-500 text-sm' onClick={() => {
              setFormData(profile || {});
              setIsEditing(false);
            }}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 space-y-2 text-sm text-gray-400">
          <ProfileDetails profile={profile} />
        </div>
      )}
    </div>
  );
};

export default ProfileSection;