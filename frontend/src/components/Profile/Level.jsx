import React from 'react';


export function Level({level, levelPercentage}) {
  return (
    <div className="w-full transition-all flex flex-col items-center">
      Level {level}
      <div className="w-full h-2 bg-gray-50/20 rounded-full">
        <div className={`w-[${levelPercentage}%] h-full rounded-full bg-gradient-to-r from-[#9312D0] to-[#45096A]`}/>
      </div>
    </div>
  );
}
