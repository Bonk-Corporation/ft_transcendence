import React from 'react';
import { Card } from './Card';
import { Input } from './Input';
import { CTA } from './CTA';
import { Level } from './Level';

export function ProfileCard({profile}) {
  return (
    <div>
        <Card className='flex flex-col items-center justify-center p-6 h-full'>
            <div className="flex items-center">
                <div className={`rounded-full w-32 mr-4 aspect-square bg-[url(${profile.avatar})] bg-center bg-cover`} />
                <div className="flex flex-col">
									<Input className="my-2" placeholder={`${profile.name}`}/>
									<Input className="my-2" placeholder={`${profile.email}`} />
								</div>
            </div>
						<div className="my-4 flex flex-col w-full">
								<Input className="w-full mb-2" placeholder="New password"/>
								<Input className="w-full mt-2" placeholder="Confirm password"/>
						</div>
						<CTA className='mb-4'>Update</CTA>
						<Level level={profile.level} levelPercentage={profile.levelPercentage}/>
        </Card>
    </div>
  );
}
