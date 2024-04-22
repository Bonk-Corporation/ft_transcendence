import React from 'react';
import { ProfileCard } from '../../components/ProfileCard';

export function Profile({profile}) {
  return (
    <div>
      <ProfileCard profile={profile} />
    </div>
  );
}