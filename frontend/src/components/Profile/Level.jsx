import React from 'react';
import { language } from '../../scripts/languages';


export function Level({lang, level, levelPercentage}) {
  return (
    <div className="w-full transition-all flex flex-col items-center">
      {language.level[lang]} {level}
      <div className="w-full h-2 bg-gray-50/20 rounded-full">
        <div className={`w-[${levelPercentage}%] h-full rounded-full bg-gradient-to-r from-[#9312D0] to-[#45096A]`}/>
      </div>
    </div>
  );
}
