import React, { useContext } from 'react';
import { language } from '../../scripts/languages';
import { LangContext, ProfileContext } from '../../Contexts';


export function LogCard(props) {
  const profile = useContext(ProfileContext);
	const lang = useContext(LangContext);

  return (
      <a href="/profile" className="flex items-center rounded-full hover:bg-white transition-all group hover:cursor-pointer pr-4">
        <div className={`h-12 aspect-square mr-4 rounded-full border-2 border-white bg-[url(${profile ? profile.avatar : null})] bg-center bg-cover`}></div>
        <div>
          <h1 className="group-hover:text-black transition-all">{profile ? profile.name : null}</h1>
          <h1 className="group-hover:text-black font-medium text-sm transition-all">{profile ? `${language.level[lang]} ${profile.level}` : null}</h1>
        </div>
      </a>
  );
}
