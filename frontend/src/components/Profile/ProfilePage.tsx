"use client";

import { useAuthStore } from '@/store/authStore';
import { ChevronLeft, MoreVertical, Pencil } from 'lucide-react';
import { useState, useRef } from 'react';
import { Profile, User } from '@/types/auth';
import ProfileSection from './AboutSection';
import Link from 'next/link';

function ProfilePage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleProfileUpdate = (updatedProfile: Profile) => {
    useAuthStore.setState({ user: { ...user, ...updatedProfile } });
  };

  return (
    <div className="min-h-screen">
      <div className="w-full max-w-md mx-auto relative">


        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-2">
            <ChevronLeft className="w-6 h-6 text-white" />
            <span className="text-base font-medium text-white">Back</span>
          </div>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="focus:outline-none"
            >
              <MoreVertical className="w-6 h-6 text-white" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-24 py-2 bg-[#1C1C1C] rounded-lg shadow-lg z-50">
                <button
                  className="w-full px-4 py-1 text-left text-sm text-red-500"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    logout();
                  }}
                >
                  Logout
                </button>

              </div>
            )}
          </div>
        </div>
        <h6 className="text-sm font-medium text-white text-center">{user?.name}</h6>

        <div className="px-4 pt-1 mt-2">
          <div
            className="w-full aspect-[1.91/1] bg-[#162329] rounded-2xl mb-6 relative overflow-hidden flex items-end"
            style={{
              backgroundImage: user?.profileImage ? `url(${user.profileImage})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="w-full h-full flex flex-col justify-end bg-gradient-to-t from-black/50 to-transparent p-4">
              <span className="text-sm font-medium text-white">{user?.name}</span>

              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs px-2 py-1 bg-[#1C1C1C] text-white rounded-md">
                  {user?.gender || "Male"}
                </span>
                <span className="text-xs px-2 py-1 bg-[#1C1C1C] text-white rounded-md">
                  {user?.zodiac || "Zodiac"}
                </span>
                <span className="text-xs px-2 py-1 bg-[#1C1C1C] text-white rounded-md">
                  {user?.horoscope || "Horoscope"}
                </span>
              </div>
            </div>
          </div>

          <ProfileSection onProfileUpdate={handleProfileUpdate} onImageSelect={(imageUrl) => {
            if (!user) return;
            useAuthStore.setState({ user: { ...(user as User), profileImage: imageUrl } });
          }} />

          <div className="bg-[#162329] rounded-2xl p-5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-medium text-white">Interest</h3>

              </div>
              <Link href={'/profile/interests'} passHref>
                <button className="mt-1 p-1">
                  <Pencil className="w-[18px] h-[18px] text-gray-400" />
                </button>
              </Link>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {user?.interests?.length ? (
                user.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="bg-[#22363A] text-sm px-3 py-1 rounded-full text-white"
                  >
                    {interest}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-400 mt-1.5">
                  Add in your interests to find a better match
                </p>
              )}
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
