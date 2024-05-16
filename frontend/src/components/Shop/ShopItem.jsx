import React, {useState} from 'react';
import { PopUp } from '../utils/PopUp';
import { Card } from '../utils/Card';
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
            <BallPresentation limit={true} images={props.item.images}/>
            <h1 className="md:text-xl font-medium text-center">{props.item.name}</h1>
            <Price price={props.item.price}/>
        </Card>
      </div>
    </div>
  );
}
