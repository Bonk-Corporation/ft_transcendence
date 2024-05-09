from django.urls import path
from django.http.response import JsonResponse


def me(request, *args, **kwargs):
    if request.user.is_authenticated:
        return JsonResponse(
            {
                "username": request.user.username,
                "display_name": request.user.display_name,
                "id": request.user.id,
            }
        )
    return JsonResponse(
        {
            "error": "You need to be logged in",
        },
        status=401,
    )


def fakeMe(request, *args, **kwargs):
    return JsonResponse(
        {
            "name": "DinoMalin",
            "email": "dinomalin@gmail.com",
            "level": 18,
            "levelPercentage": 78,
            "avatar": "https://i.pinimg.com/236x/9d/58/d1/9d58d1fba36aa76996b5de3f3d233d22.jpg",
            "friends": [
                {
                    "name": "FeuilleMorte",
                    "avatar": "https://i.ytimg.com/vi/lX7ofuGJl6Y/hqdefault.jpg",
                    "level": 4,
                },
                {
                    "name": "Feur",
                    "avatar": "https://www.itadori-shop.com/cdn/shop/articles/Satoru-Hollow-Purple-e1615636661895_1200x1200.jpg?v=1634757049",
                    "level": 42,
                },
                {
                    "name": "Bolvic",
                    "avatar": "https://user-images.githubusercontent.com/8974888/231858967-7c37bf1e-335b-4f5a-9760-da97be9f54bb.png",
                    "level": 21,
                },
                {
                    "name": "MaxMaxicoMax",
                    "avatar": "https://s2.coinmarketcap.com/static/img/coins/200x200/23095.png",
                    "level": 21,
                },
                {
                    "name": "ndavenne",
                    "avatar": "https://upload.wikimedia.org/wikipedia/commons/3/3d/Noah_mosaic.JPG",
                    "level": 666,
                },
            ],
            "gameHistory": [
                {
                    "game": "Pong",
                    "score": [4, 1],
                    "win": True,
                },
                {
                    "game": "Bonk",
                    "score": [1, 4],
                    "win": False,
                },
                {
                    "game": "Bonk",
                    "score": [4, 1],
                    "win": True,
                },
                {
                    "game": "Pong",
                    "score": [4, 1],
                    "win": True,
                },
                {
                    "game": "Pong",
                    "score": [4, 1],
                    "win": True,
                },
                {
                    "game": "Bonk",
                    "score": [1, 4],
                    "win": False,
                },
                {
                    "game": "Bonk",
                    "score": [1, 4],
                    "win": True,
                },
                {
                    "game": "Pong",
                    "score": [1, 4],
                    "win": False,
                },
            ],
        }
    )


def fakeShop(request, *args, **kwargs):
    return JsonResponse(
        {
            "items": [
                {
                    "name": "Division Alpha",
                    "price": 42,
                    "images": [
                        "https://cdn.intra.42.fr/users/f5211c252a861a78f71e9a977eecadb4/cgodard.jpg",
                        "https://cdn.intra.42.fr/users/2b962c2f87957ce08fbe70ead1b2d0e0/jcario.jpg",
                        "https://cdn.intra.42.fr/users/9f5698d30801a374858a63b354f4ca25/nlaerema.jpg",
                    ],
                },
                {
                    "name": "Division Omega",
                    "price": 42,
                    "images": [
                        "https://cdn.intra.42.fr/users/55987e93531eacc6670b9342bff179bf/acasamit.jpg",
                        "https://cdn.intra.42.fr/users/9c1989814454e162b543d9b35af28d96/vcornill.jpg",
                        "https://cdn.intra.42.fr/users/ce7e815df34d780257a3ab64531a451b/gprigent.jpg",
                    ],
                },
                {
                    "name": "Mborde",
                    "price": 4.2,
                    "images": [
                        "https://cdn.intra.42.fr/users/257ab29fd7a68e0257282a6b5b046bee/mborde.jpg",
                        "https://cdn.intra.42.fr/users/d7dceec8fc1505efeba220b3148c41a7/maxborde.jpg",
                        "https://cdn.intra.42.fr/users/8c105f51da7a505b26b34e3187c9d902/mbordeau.jpg",
                    ],
                },
                {
                    "name": "Jesus",
                    "price": 4.2,
                    "images": [
                        "https://cdn.intra.42.fr/users/446d692244af8c9e39b660b66118be58/ndavenne.jpg",
                        "https://cdn.intra.42.fr/users/9c1989814454e162b543d9b35af28d96/vcornill.jpg",
                        "https://cdn.intra.42.fr/users/854ee8fb6eafd384ff559fd254e72c18/aboyreau.jpg",
                    ],
                },
                {
                    "name": "Dinosaur",
                    "price": 4.2,
                    "images": [
                        "https://media.sciencephoto.com/c0/48/95/68/c0489568-800px-wm.jpg",
                        "https://blogarchive.goodillustration.com/wp-content/uploads/2019/10/33.jpg",
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUfRlMh3Gbxm22Ek6ZaR3nF6dbzlNcJ9yqBNeHQdPHKQ&s",
                    ],
                },
                {
                    "name": "Aubry",
                    "price": 4.2,
                    "images": [
                        "https://cdn.intra.42.fr/users/6f9119adac51226a61751bf9b54f48c9/laubry.jpg",
                        "https://media.licdn.com/dms/image/D4E03AQGv404fgohKAg/profile-displayphoto-shrink_800_800/0/1698841538292?e=2147483647&v=beta&t=PrNo5PYobtrL1XKcsuL2RBMYw_EyKagVmzLanejGB8w",
                        "https://cdn.intra.42.fr/users/14f60872383a99767bce8e93260aa69d/kaubry.jpg",
                    ],
                },
                {
                    "name": "Dictionnaire",
                    "price": 4.2,
                    "images": [
                        "https://cdn.intra.42.fr/users/5ced09dd1359578b97cd25cb3851b5a0/rriviere.jpg",
                        "https://cdn.intra.42.fr/users/4a14e47f1f9d84475a17b02658062de0/atellier.jpg",
                        "https://cdn.intra.42.fr/users/c5f71e71bac34ba63fc3ddcc18804b0b/rrouille.jpg",
                    ],
                },
                {
                    "name": "Louis",
                    "price": 4.2,
                    "images": [
                        "https://media.discordapp.net/attachments/1183935721086660659/1195034771110240407/IMG_20240111_170017.jpg?ex=663d9c1c&is=663c4a9c&hm=9133d5a423c146a2a249d7669b8babaf6c4a502436e5a243bda06ef9f2d23c00&=&format=webp&width=446&height=592",
                        "https://cdn.intra.42.fr/users/bfdda89cc2018c20ccd09ab2c8f788cd/lgalloux.jpg",
                        "https://cdn.discordapp.com/attachments/1222318836255162469/1238138328386244638/20240508_001427.jpg?ex=663e31ac&is=663ce02c&hm=19ef63b02e070054639c52a820c250f92ec0db4c2187fb52c3c6c0e4c46f49df&",
                    ],
                },
                {
                    "name": "8",
                    "price": 4.2,
                    "images": [
                        "https://img.freepik.com/photos-gratuite/fond-texture-abstrait_1258-30484.jpg?size=338&ext=jpg&ga=GA1.1.867424154.1713398400&semt=ais",
                        "https://www.solidbackgrounds.com/images/2048x2048/2048x2048-boston-university-red-solid-color-background.jpg",
                        "https://i.pinimg.com/474x/22/18/6d/22186db2db07e9ec68f66cfb537e0aa5.jpg",
                    ],
                },
                {
                    "name": "9",
                    "price": 4.2,
                    "images": [
                        "https://img.freepik.com/photos-gratuite/fond-texture-abstrait_1258-30484.jpg?size=338&ext=jpg&ga=GA1.1.867424154.1713398400&semt=ais",
                        "https://www.solidbackgrounds.com/images/2048x2048/2048x2048-boston-university-red-solid-color-background.jpg",
                        "https://i.pinimg.com/474x/22/18/6d/22186db2db07e9ec68f66cfb537e0aa5.jpg",
                    ],
                },
                {
                    "name": "10",
                    "price": 4.2,
                    "images": [
                        "https://img.freepik.com/photos-gratuite/fond-texture-abstrait_1258-30484.jpg?size=338&ext=jpg&ga=GA1.1.867424154.1713398400&semt=ais",
                        "https://www.solidbackgrounds.com/images/2048x2048/2048x2048-boston-university-red-solid-color-background.jpg",
                        "https://i.pinimg.com/474x/22/18/6d/22186db2db07e9ec68f66cfb537e0aa5.jpg",
                    ],
                },
                {
                    "name": "11",
                    "price": 4.2,
                    "images": [
                        "https://img.freepik.com/photos-gratuite/fond-texture-abstrait_1258-30484.jpg?size=338&ext=jpg&ga=GA1.1.867424154.1713398400&semt=ais",
                        "https://www.solidbackgrounds.com/images/2048x2048/2048x2048-boston-university-red-solid-color-background.jpg",
                        "https://i.pinimg.com/474x/22/18/6d/22186db2db07e9ec68f66cfb537e0aa5.jpg",
                    ],
                },
                {
                    "name": "12",
                    "price": 4.2,
                    "images": [
                        "https://img.freepik.com/photos-gratuite/fond-texture-abstrait_1258-30484.jpg?size=338&ext=jpg&ga=GA1.1.867424154.1713398400&semt=ais",
                        "https://www.solidbackgrounds.com/images/2048x2048/2048x2048-boston-university-red-solid-color-background.jpg",
                        "https://i.pinimg.com/474x/22/18/6d/22186db2db07e9ec68f66cfb537e0aa5.jpg",
                    ],
                },
                {
                    "name": "13",
                    "price": 4.2,
                    "images": [
                        "https://img.freepik.com/photos-gratuite/fond-texture-abstrait_1258-30484.jpg?size=338&ext=jpg&ga=GA1.1.867424154.1713398400&semt=ais",
                        "https://www.solidbackgrounds.com/images/2048x2048/2048x2048-boston-university-red-solid-color-background.jpg",
                        "https://i.pinimg.com/474x/22/18/6d/22186db2db07e9ec68f66cfb537e0aa5.jpg",
                    ],
                },
                {
                    "name": "14",
                    "price": 4.2,
                    "images": [
                        "https://img.freepik.com/photos-gratuite/fond-texture-abstrait_1258-30484.jpg?size=338&ext=jpg&ga=GA1.1.867424154.1713398400&semt=ais",
                        "https://www.solidbackgrounds.com/images/2048x2048/2048x2048-boston-university-red-solid-color-background.jpg",
                        "https://i.pinimg.com/474x/22/18/6d/22186db2db07e9ec68f66cfb537e0aa5.jpg",
                    ],
                },
                {
                    "name": "15",
                    "price": 4.2,
                    "images": [
                        "https://img.freepik.com/photos-gratuite/fond-texture-abstrait_1258-30484.jpg?size=338&ext=jpg&ga=GA1.1.867424154.1713398400&semt=ais",
                        "https://www.solidbackgrounds.com/images/2048x2048/2048x2048-boston-university-red-solid-color-background.jpg",
                        "https://i.pinimg.com/474x/22/18/6d/22186db2db07e9ec68f66cfb537e0aa5.jpg",
                    ],
                },
                {
                    "name": "16",
                    "price": 4.2,
                    "images": [
                        "https://img.freepik.com/photos-gratuite/fond-texture-abstrait_1258-30484.jpg?size=338&ext=jpg&ga=GA1.1.867424154.1713398400&semt=ais",
                        "https://www.solidbackgrounds.com/images/2048x2048/2048x2048-boston-university-red-solid-color-background.jpg",
                        "https://i.pinimg.com/474x/22/18/6d/22186db2db07e9ec68f66cfb537e0aa5.jpg",
                    ],
                },
                {
                    "name": "17",
                    "price": 4.2,
                    "images": [
                        "https://img.freepik.com/photos-gratuite/fond-texture-abstrait_1258-30484.jpg?size=338&ext=jpg&ga=GA1.1.867424154.1713398400&semt=ais",
                        "https://www.solidbackgrounds.com/images/2048x2048/2048x2048-boston-university-red-solid-color-background.jpg",
                        "https://i.pinimg.com/474x/22/18/6d/22186db2db07e9ec68f66cfb537e0aa5.jpg",
                    ],
                },
                {
                    "name": "18",
                    "price": 4.2,
                    "images": [
                        "https://img.freepik.com/photos-gratuite/fond-texture-abstrait_1258-30484.jpg?size=338&ext=jpg&ga=GA1.1.867424154.1713398400&semt=ais",
                        "https://www.solidbackgrounds.com/images/2048x2048/2048x2048-boston-university-red-solid-color-background.jpg",
                        "https://i.pinimg.com/474x/22/18/6d/22186db2db07e9ec68f66cfb537e0aa5.jpg",
                    ],
                },
                {
                    "name": "19",
                    "price": 4.2,
                    "images": [
                        "https://img.freepik.com/photos-gratuite/fond-texture-abstrait_1258-30484.jpg?size=338&ext=jpg&ga=GA1.1.867424154.1713398400&semt=ais",
                        "https://www.solidbackgrounds.com/images/2048x2048/2048x2048-boston-university-red-solid-color-background.jpg",
                        "https://i.pinimg.com/474x/22/18/6d/22186db2db07e9ec68f66cfb537e0aa5.jpg",
                    ],
                },
                {
                    "name": "20",
                    "price": 4.2,
                    "images": [
                        "https://img.freepik.com/photos-gratuite/fond-texture-abstrait_1258-30484.jpg?size=338&ext=jpg&ga=GA1.1.867424154.1713398400&semt=ais",
                        "https://www.solidbackgrounds.com/images/2048x2048/2048x2048-boston-university-red-solid-color-background.jpg",
                        "https://i.pinimg.com/474x/22/18/6d/22186db2db07e9ec68f66cfb537e0aa5.jpg",
                    ],
                },
                {
                    "name": "21",
                    "price": 4.2,
                    "images": [
                        "https://img.freepik.com/photos-gratuite/fond-texture-abstrait_1258-30484.jpg?size=338&ext=jpg&ga=GA1.1.867424154.1713398400&semt=ais",
                        "https://www.solidbackgrounds.com/images/2048x2048/2048x2048-boston-university-red-solid-color-background.jpg",
                        "https://i.pinimg.com/474x/22/18/6d/22186db2db07e9ec68f66cfb537e0aa5.jpg",
                    ],
                },
                {
                    "name": "22",
                    "price": 4.2,
                    "images": [
                        "https://img.freepik.com/photos-gratuite/fond-texture-abstrait_1258-30484.jpg?size=338&ext=jpg&ga=GA1.1.867424154.1713398400&semt=ais",
                        "https://www.solidbackgrounds.com/images/2048x2048/2048x2048-boston-university-red-solid-color-background.jpg",
                        "https://i.pinimg.com/474x/22/18/6d/22186db2db07e9ec68f66cfb537e0aa5.jpg",
                    ],
                },
                {
                    "name": "23",
                    "price": 4.2,
                    "images": [
                        "https://img.freepik.com/photos-gratuite/fond-texture-abstrait_1258-30484.jpg?size=338&ext=jpg&ga=GA1.1.867424154.1713398400&semt=ais",
                        "https://prmeng.rosselcdn.net/sites/default/files/dpistyles_v2/prm_16_9_856w/2023/06/21/node_425356/39637804/public/2023/06/21/B9734575952Z.1_20230621112436_000%2BGGSN0H790.2-0.jpg?itok=oWws-LR71687339485",
                        "https://i.pinimg.com/474x/22/18/6d/22186db2db07e9ec68f66cfb537e0aa5.jpg",
                    ],
                },
            ]
        }
    )


urls = [
    path("me", fakeMe),
    path("shop", fakeShop),
]
