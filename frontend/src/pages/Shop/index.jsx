import {ShopItem} from '../../components/ShopItem';
import { useState } from 'preact/hooks';
const items = [
{
  name: "1",
  price: 4.2,
  images: [
    "https://img.freepik.com/photos-gratuite/fond-texture-abstrait_1258-30484.jpg?size=338&ext=jpg&ga=GA1.1.867424154.1713398400&semt=ais",
    "https://www.solidbackgrounds.com/images/2048x2048/2048x2048-boston-university-red-solid-color-background.jpg",
    "https://i.pinimg.com/474x/22/18/6d/22186db2db07e9ec68f66cfb537e0aa5.jpg"
  ]
},
{
  name: "2",
  price: 4.2,
  images: [
    "https://img.freepik.com/photos-gratuite/fond-texture-abstrait_1258-30484.jpg?size=338&ext=jpg&ga=GA1.1.867424154.1713398400&semt=ais",
    "https://www.solidbackgrounds.com/images/2048x2048/2048x2048-boston-university-red-solid-color-background.jpg",
    "https://i.pinimg.com/474x/22/18/6d/22186db2db07e9ec68f66cfb537e0aa5.jpg"
  ]
},
{
  name: "3",
  price: 4.2,
  images: [
    "https://img.freepik.com/photos-gratuite/fond-texture-abstrait_1258-30484.jpg?size=338&ext=jpg&ga=GA1.1.867424154.1713398400&semt=ais",
    "https://www.solidbackgrounds.com/images/2048x2048/2048x2048-boston-university-red-solid-color-background.jpg",
    "https://i.pinimg.com/474x/22/18/6d/22186db2db07e9ec68f66cfb537e0aa5.jpg"
  ]
},
{
  name: "4",
  price: 4.2,
  images: [
    "https://img.freepik.com/photos-gratuite/fond-texture-abstrait_1258-30484.jpg?size=338&ext=jpg&ga=GA1.1.867424154.1713398400&semt=ais",
    "https://www.solidbackgrounds.com/images/2048x2048/2048x2048-boston-university-red-solid-color-background.jpg",
    "https://i.pinimg.com/474x/22/18/6d/22186db2db07e9ec68f66cfb537e0aa5.jpg"
  ]
},
{
  name: "5",
  price: 4.2,
  images: [
    "https://img.freepik.com/photos-gratuite/fond-texture-abstrait_1258-30484.jpg?size=338&ext=jpg&ga=GA1.1.867424154.1713398400&semt=ais",
    "https://www.solidbackgrounds.com/images/2048x2048/2048x2048-boston-university-red-solid-color-background.jpg",
    "https://i.pinimg.com/474x/22/18/6d/22186db2db07e9ec68f66cfb537e0aa5.jpg"
  ]
},
{
  name: "6",
  price: 4.2,
  images: [
    "https://img.freepik.com/photos-gratuite/fond-texture-abstrait_1258-30484.jpg?size=338&ext=jpg&ga=GA1.1.867424154.1713398400&semt=ais",
    "https://www.solidbackgrounds.com/images/2048x2048/2048x2048-boston-university-red-solid-color-background.jpg",
    "https://i.pinimg.com/474x/22/18/6d/22186db2db07e9ec68f66cfb537e0aa5.jpg"
  ]
},
{
  name: "7",
  price: 4.2,
  images: [
    "https://img.freepik.com/photos-gratuite/fond-texture-abstrait_1258-30484.jpg?size=338&ext=jpg&ga=GA1.1.867424154.1713398400&semt=ais",
    "https://www.solidbackgrounds.com/images/2048x2048/2048x2048-boston-university-red-solid-color-background.jpg",
    "https://i.pinimg.com/474x/22/18/6d/22186db2db07e9ec68f66cfb537e0aa5.jpg"
  ]
},
{
  name: "8",
  price: 4.2,
  images: [
    "https://img.freepik.com/photos-gratuite/fond-texture-abstrait_1258-30484.jpg?size=338&ext=jpg&ga=GA1.1.867424154.1713398400&semt=ais",
    "https://www.solidbackgrounds.com/images/2048x2048/2048x2048-boston-university-red-solid-color-background.jpg",
    "https://i.pinimg.com/474x/22/18/6d/22186db2db07e9ec68f66cfb537e0aa5.jpg"
  ]
},
{
  name: "9",
  price: 4.2,
  images: [
    "https://img.freepik.com/photos-gratuite/fond-texture-abstrait_1258-30484.jpg?size=338&ext=jpg&ga=GA1.1.867424154.1713398400&semt=ais",
    "https://www.solidbackgrounds.com/images/2048x2048/2048x2048-boston-university-red-solid-color-background.jpg",
    "https://i.pinimg.com/474x/22/18/6d/22186db2db07e9ec68f66cfb537e0aa5.jpg"
  ]
},
{
  name: "10",
  price: 4.2,
  images: [
    "https://img.freepik.com/photos-gratuite/fond-texture-abstrait_1258-30484.jpg?size=338&ext=jpg&ga=GA1.1.867424154.1713398400&semt=ais",
    "https://www.solidbackgrounds.com/images/2048x2048/2048x2048-boston-university-red-solid-color-background.jpg",
    "https://i.pinimg.com/474x/22/18/6d/22186db2db07e9ec68f66cfb537e0aa5.jpg"
  ]
},
{
  name: "11",
  price: 4.2,
  images: [
    "https://img.freepik.com/photos-gratuite/fond-texture-abstrait_1258-30484.jpg?size=338&ext=jpg&ga=GA1.1.867424154.1713398400&semt=ais",
    "https://www.solidbackgrounds.com/images/2048x2048/2048x2048-boston-university-red-solid-color-background.jpg",
    "https://i.pinimg.com/474x/22/18/6d/22186db2db07e9ec68f66cfb537e0aa5.jpg"
  ]
},
{
  name: "12",
  price: 4.2,
  images: [
    "https://img.freepik.com/photos-gratuite/fond-texture-abstrait_1258-30484.jpg?size=338&ext=jpg&ga=GA1.1.867424154.1713398400&semt=ais",
    "https://www.solidbackgrounds.com/images/2048x2048/2048x2048-boston-university-red-solid-color-background.jpg",
    "https://i.pinimg.com/474x/22/18/6d/22186db2db07e9ec68f66cfb537e0aa5.jpg"
  ]
},

{
  name: "13",
  price: 4.2,
  images: [
    "https://img.freepik.com/photos-gratuite/fond-texture-abstrait_1258-30484.jpg?size=338&ext=jpg&ga=GA1.1.867424154.1713398400&semt=ais",
    "https://www.solidbackgrounds.com/images/2048x2048/2048x2048-boston-university-red-solid-color-background.jpg",
    "https://i.pinimg.com/474x/22/18/6d/22186db2db07e9ec68f66cfb537e0aa5.jpg"
  ]
},
{
  name: "14",
  price: 4.2,
  images: [
    "https://img.freepik.com/photos-gratuite/fond-texture-abstrait_1258-30484.jpg?size=338&ext=jpg&ga=GA1.1.867424154.1713398400&semt=ais",
    "https://www.solidbackgrounds.com/images/2048x2048/2048x2048-boston-university-red-solid-color-background.jpg",
    "https://i.pinimg.com/474x/22/18/6d/22186db2db07e9ec68f66cfb537e0aa5.jpg"
  ]
},
{
  name: "15",
  price: 4.2,
  images: [
    "https://img.freepik.com/photos-gratuite/fond-texture-abstrait_1258-30484.jpg?size=338&ext=jpg&ga=GA1.1.867424154.1713398400&semt=ais",
    "https://www.solidbackgrounds.com/images/2048x2048/2048x2048-boston-university-red-solid-color-background.jpg",
    "https://i.pinimg.com/474x/22/18/6d/22186db2db07e9ec68f66cfb537e0aa5.jpg"
  ]
},
{
  name: "16",
  price: 4.2,
  images: [
    "https://img.freepik.com/photos-gratuite/fond-texture-abstrait_1258-30484.jpg?size=338&ext=jpg&ga=GA1.1.867424154.1713398400&semt=ais",
    "https://www.solidbackgrounds.com/images/2048x2048/2048x2048-boston-university-red-solid-color-background.jpg",
    "https://i.pinimg.com/474x/22/18/6d/22186db2db07e9ec68f66cfb537e0aa5.jpg"
  ]
},
{
  name: "17",
  price: 4.2,
  images: [
    "https://img.freepik.com/photos-gratuite/fond-texture-abstrait_1258-30484.jpg?size=338&ext=jpg&ga=GA1.1.867424154.1713398400&semt=ais",
    "https://www.solidbackgrounds.com/images/2048x2048/2048x2048-boston-university-red-solid-color-background.jpg",
    "https://i.pinimg.com/474x/22/18/6d/22186db2db07e9ec68f66cfb537e0aa5.jpg"
  ]
},
{
  name: "18",
  price: 4.2,
  images: [
    "https://img.freepik.com/photos-gratuite/fond-texture-abstrait_1258-30484.jpg?size=338&ext=jpg&ga=GA1.1.867424154.1713398400&semt=ais",
    "https://www.solidbackgrounds.com/images/2048x2048/2048x2048-boston-university-red-solid-color-background.jpg",
    "https://i.pinimg.com/474x/22/18/6d/22186db2db07e9ec68f66cfb537e0aa5.jpg"
  ]
},
{
  name: "19",
  price: 4.2,
  images: [
    "https://img.freepik.com/photos-gratuite/fond-texture-abstrait_1258-30484.jpg?size=338&ext=jpg&ga=GA1.1.867424154.1713398400&semt=ais",
    "https://www.solidbackgrounds.com/images/2048x2048/2048x2048-boston-university-red-solid-color-background.jpg",
    "https://i.pinimg.com/474x/22/18/6d/22186db2db07e9ec68f66cfb537e0aa5.jpg"
  ]
},
{
  name: "20",
  price: 4.2,
  images: [
    "https://img.freepik.com/photos-gratuite/fond-texture-abstrait_1258-30484.jpg?size=338&ext=jpg&ga=GA1.1.867424154.1713398400&semt=ais",
    "https://www.solidbackgrounds.com/images/2048x2048/2048x2048-boston-university-red-solid-color-background.jpg",
    "https://i.pinimg.com/474x/22/18/6d/22186db2db07e9ec68f66cfb537e0aa5.jpg"
  ]
},
{
  name: "21",
  price: 4.2,
  images: [
    "https://img.freepik.com/photos-gratuite/fond-texture-abstrait_1258-30484.jpg?size=338&ext=jpg&ga=GA1.1.867424154.1713398400&semt=ais",
    "https://www.solidbackgrounds.com/images/2048x2048/2048x2048-boston-university-red-solid-color-background.jpg",
    "https://i.pinimg.com/474x/22/18/6d/22186db2db07e9ec68f66cfb537e0aa5.jpg"
  ]
},
{
  name: "22",
  price: 4.2,
  images: [
    "https://img.freepik.com/photos-gratuite/fond-texture-abstrait_1258-30484.jpg?size=338&ext=jpg&ga=GA1.1.867424154.1713398400&semt=ais",
    "https://www.solidbackgrounds.com/images/2048x2048/2048x2048-boston-university-red-solid-color-background.jpg",
    "https://i.pinimg.com/474x/22/18/6d/22186db2db07e9ec68f66cfb537e0aa5.jpg"
  ]
},
{
  name: "23",
  price: 4.2,
  images: [
    "https://img.freepik.com/photos-gratuite/fond-texture-abstrait_1258-30484.jpg?size=338&ext=jpg&ga=GA1.1.867424154.1713398400&semt=ais",
    "https://www.solidbackgrounds.com/images/2048x2048/2048x2048-boston-university-red-solid-color-background.jpg",
    "https://i.pinimg.com/474x/22/18/6d/22186db2db07e9ec68f66cfb537e0aa5.jpg"
  ]
},
{
  name: "24",
  price: 4.2,
  images: [
    "https://img.freepik.com/photos-gratuite/fond-texture-abstrait_1258-30484.jpg?size=338&ext=jpg&ga=GA1.1.867424154.1713398400&semt=ais",
    "https://prmeng.rosselcdn.net/sites/default/files/dpistyles_v2/prm_16_9_856w/2023/06/21/node_425356/39637804/public/2023/06/21/B9734575952Z.1_20230621112436_000%2BGGSN0H790.2-0.jpg?itok=oWws-LR71687339485",
    "https://i.pinimg.com/474x/22/18/6d/22186db2db07e9ec68f66cfb537e0aa5.jpg"
  ]
}
]


export function Shop() {
  const [page, setPage] = useState(0);

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-4 gap-8 my-4">
        {items.slice(page * 12, (page + 1) * 12).map((item, idx) => (<ShopItem item={item} />))}
      </div>
      <div className="flex items-center">
        <svg onClick={() => {setPage(page > 0 ? page - 1 : page)}} className="w-6 fill-white/40 cursor-pointer hover:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path d="M9.4 278.6c-12.5-12.5-12.5-32.8 0-45.3l128-128c9.2-9.2 22.9-11.9 34.9-6.9s19.8 16.6 19.8 29.6l0 256c0 12.9-7.8 24.6-19.8 29.6s-25.7 2.2-34.9-6.9l-128-128z"/></svg>
        <h1>{page + 1}</h1>
        <svg onClick={() => {setPage(page + 1 < items.length / 12 ? page + 1 : page)}} className="w-6 fill-white/40 cursor-pointer hover:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path d="M246.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6l0 256c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l128-128z"/></svg>
      </div>
    </div>
  );
}
