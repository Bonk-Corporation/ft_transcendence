import {ShopItem} from '../../components/Shop/ShopItem';
import { useState } from 'preact/hooks';
import { PopUp } from '../../components/utils/PopUp';

const items = [
{
  name: "Division Alpha",
  price: 42,
  images: [
    "https://cdn.intra.42.fr/users/f5211c252a861a78f71e9a977eecadb4/cgodard.jpg",
    "https://cdn.intra.42.fr/users/2b962c2f87957ce08fbe70ead1b2d0e0/jcario.jpg",
    "https://cdn.intra.42.fr/users/9f5698d30801a374858a63b354f4ca25/nlaerema.jpg"
  ]
},
{
  name: "Division Omega",
  price: 42,
  images: [
    "https://cdn.intra.42.fr/users/55987e93531eacc6670b9342bff179bf/acasamit.jpg",
    "https://cdn.intra.42.fr/users/9c1989814454e162b543d9b35af28d96/vcornill.jpg",
    "https://cdn.intra.42.fr/users/ce7e815df34d780257a3ab64531a451b/gprigent.jpg"
  ]
},

{
  name: "Mborde",
  price: 4.2,
  images: [
    "https://cdn.intra.42.fr/users/257ab29fd7a68e0257282a6b5b046bee/mborde.jpg",
    "https://cdn.intra.42.fr/users/d7dceec8fc1505efeba220b3148c41a7/maxborde.jpg",
    "https://cdn.intra.42.fr/users/8c105f51da7a505b26b34e3187c9d902/mbordeau.jpg",
  ]
},
{
  name: "Jesus",
  price: 4.2,
  images: [
    "https://cdn.intra.42.fr/users/446d692244af8c9e39b660b66118be58/ndavenne.jpg",
    "https://cdn.intra.42.fr/users/9c1989814454e162b543d9b35af28d96/vcornill.jpg",
    "https://cdn.intra.42.fr/users/854ee8fb6eafd384ff559fd254e72c18/aboyreau.jpg"
  ]
},
{
  name: "Dinosaur",
  price: 4.2,
  images: [
    "https://media.sciencephoto.com/c0/48/95/68/c0489568-800px-wm.jpg",
    "https://blogarchive.goodillustration.com/wp-content/uploads/2019/10/33.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUfRlMh3Gbxm22Ek6ZaR3nF6dbzlNcJ9yqBNeHQdPHKQ&s"
  ]
},
{
  name: "Aubry",
  price: 4.2,
  images: [
    "https://cdn.intra.42.fr/users/6f9119adac51226a61751bf9b54f48c9/laubry.jpg",
    "https://media.licdn.com/dms/image/D4E03AQGv404fgohKAg/profile-displayphoto-shrink_800_800/0/1698841538292?e=2147483647&v=beta&t=PrNo5PYobtrL1XKcsuL2RBMYw_EyKagVmzLanejGB8w",
    "https://cdn.intra.42.fr/users/14f60872383a99767bce8e93260aa69d/kaubry.jpg"
  ]
},
{
  name: "Dictionnaire",
  price: 4.2,
  images: [
    "https://cdn.intra.42.fr/users/5ced09dd1359578b97cd25cb3851b5a0/rriviere.jpg",
    "https://cdn.intra.42.fr/users/4a14e47f1f9d84475a17b02658062de0/atellier.jpg",
    "https://cdn.intra.42.fr/users/d133953cde3df8d6e7bd90b627aed54e/ggay.jpg"
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
    "https://prmeng.rosselcdn.net/sites/default/files/dpistyles_v2/prm_16_9_856w/2023/06/21/node_425356/39637804/public/2023/06/21/B9734575952Z.1_20230621112436_000%2BGGSN0H790.2-0.jpg?itok=oWws-LR71687339485",
    "https://i.pinimg.com/474x/22/18/6d/22186db2db07e9ec68f66cfb537e0aa5.jpg"
  ]
},
]


export function Shop() {
  const [page, setPage] = useState(0);

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 my-4">
        {items.slice(page * 12, (page + 1) * 12).map((item, idx) => (
          <ShopItem item={item} />
        ))}
      </div>
      <div className="flex items-center">
        <svg onClick={() => {setPage(page > 0 ? page - 1 : page)}} className={`w-6 ${page <= 0 ? "fill-white/40 hover:cursor-auto" : "fill-white/60 cursor-pointer hover:fill-white"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path d="M9.4 278.6c-12.5-12.5-12.5-32.8 0-45.3l128-128c9.2-9.2 22.9-11.9 34.9-6.9s19.8 16.6 19.8 29.6l0 256c0 12.9-7.8 24.6-19.8 29.6s-25.7 2.2-34.9-6.9l-128-128z"/></svg>
        <h1 className="select-none">{page + 1}</h1>
        <svg onClick={() => {setPage(page + 1 < items.length / 12 ? page + 1 : page)}} className={`w-6 ${page + 1 >= items.length / 12 ? "fill-white/40 hover:cursor-auto" : "fill-white/60 cursor-pointer hover:fill-white"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path d="M246.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6l0 256c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l128-128z"/></svg>
      </div>
    </div>
  );
}
