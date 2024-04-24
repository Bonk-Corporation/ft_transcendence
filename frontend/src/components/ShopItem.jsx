import React, {useState} from 'react';
import { PopUp } from './PopUp';
import { Card } from './Card';
import { Payment } from './Payment';
import { Price } from './Price';
import { BallPresentation } from './BallPresentation';


export function ShopItem(props) {
  const [popUp, setPopUp] = useState(false);

  return (
    <div>
      {popUp ?
        <PopUp active={popUp} setActive={setPopUp}>
          <Payment item={props.item} />
        </PopUp> : null
      }
      <div onClick={() => {setPopUp(true)}}>
        <Card className='flex flex-col p-4 justify-center items-center hover:cursor-pointer border-gradient-hover hover:from-white/40 hover:to-white/10 hover:mx-[-5px] hover:my-[-5px]'>
            <BallPresentation images={props.item.images}/>
            <h1 className="text-xl font-medium">{props.item.name}</h1>
            <Price price={props.item.price}/>
        </Card>
      </div>
    </div>
  );
}
