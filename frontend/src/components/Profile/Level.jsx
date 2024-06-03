import React, { useContext } from 'react';
import { language } from '../../scripts/languages';
import { LangContext } from '../../Contexts';


export function Level({level, levelPercentage}) {
  const lang = useContext(LangContext);
  return (
    <div className="w-full transition-all flex flex-col items-center">
      {language.level[lang]} {level}
      <div className="w-full h-2 bg-gray-50/20 rounded-full">
        <div
          className={`w-[${levelPercentage}%] h-full rounded-full bg-gradient-to-r from-[#9312D0] to-[#45096A]`}
        />
      </div>
    </div>
  );
}
