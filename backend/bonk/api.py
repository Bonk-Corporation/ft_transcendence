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


urls = [
    path("me", fakeMe),
]
