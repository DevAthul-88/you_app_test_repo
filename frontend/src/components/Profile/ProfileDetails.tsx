import { Profile } from '@/types/auth'
import React from 'react'

interface ProfileDetailsProps {
  profile: Profile | null;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ profile }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div>
      {profile ? (
        <div className="space-y-2 text-sm text-gray-300">
          <p><span className="text-gray-400">Birthday:</span> {formatDate(profile.birthday)}</p>
          <p><span className="text-gray-400">Horoscope:</span> {profile.horoscope || 'N/A'}</p>
          <p><span className="text-gray-400">Zodiac:</span> {profile.zodiac || 'N/A'}</p>
          <p><span className="text-gray-400">Height:</span> {profile.height ? `${profile.height} cm` : 'N/A'}</p>
          <p><span className="text-gray-400">Weight:</span> {profile.weight ? `${profile.weight} kg` : 'N/A'}</p>
        </div>
      ) : (
        <p className="text-sm text-gray-400">Add details to complete your profile.</p>
      )}
    </div>
  );
};

export default ProfileDetails;
