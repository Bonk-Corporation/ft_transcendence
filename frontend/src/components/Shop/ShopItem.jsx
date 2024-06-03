import React, {useContext, useState} from 'react';
import { PopUp } from '../utils/PopUp';
import { Card } from '../utils/Card';
import { ItemSelection } from './ItemSelection';
import { Price } from './Price';
import { BallPresentation } from './BallPresentation';
import { language } from '../../scripts/languages';
import { LangContext } from '../../Contexts';


export function ShopItem(props) {
  const [popUp, setPopUp] = useState(false);

	const lang = useContext(LangContext);

  return (
    <div>
      {popUp ?
        <PopUp active={popUp} setActive={setPopUp} className='md:px-20 px-10'>
          <ItemSelection item={props.item} possessed={props.possessed} selected={props.selected} fetchProfile={props.fetchProfile}/>
        </PopUp> : null
      }
      <div onClick={() => {setPopUp(true)}}>
        <Card className={`${props.selected ? 'border-gradient' : ""} flex flex-col p-4 justify-center items-center hover:cursor-pointer border-gradient-hover hover:from-white/40 hover:to-white/10 hover:mx-[-5px] hover:my-[-5px]`}>
            <BallPresentation limit={true} images={props.item.images}/>
            <h1 className="md:text-xl font-medium text-center">{props.item.name}</h1>
			{props.possessed ?
				<div className="bg-black border-2 rounded text-white px-2 font-semibold">{language.owned[lang]}</div>
				: <Price price={props.item.price}/>
			}
        </Card>
      </div>
    </div>
  );
}
