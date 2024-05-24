from django.urls import path, include
from django.http.response import JsonResponse
from ponk.api_decorators import authenticated
from ponk.money import urls as money_api, skins
import ponk.friends
from ponk.models import User, GameHistory
from ponk.friends import get_friends_info
from ponk.friends import get_friends_request_info
from ponk.money import skins
import ponk.private
import random
import json
import os

DEFAULT_SKINS = [
    "https://t4.ftcdn.net/jpg/03/03/40/19/360_F_303401956_ufTeSp9EX62zQnJnbed9Q0kEgqaKKL44.jpg",
    "https://htmlcolorcodes.com/assets/images/colors/bright-green-color-solid-background-1920x1080.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Solid_blue.svg/1024px-Solid_blue.svg.png",
]


def get_game_history(user):
    history = []
    for stat in GameHistory.objects.filter(user=user).all():
        history.append(
            {"game": stat.game, "score": stat.score, "win": stat.win, "xp": stat.xp}
        )
    return history


@authenticated
def me(request, *args, **kwargs):
    return JsonResponse(
        {
            "name": request.user.username,
            "email": request.user.email,
            "level": request.user.level,
            "levelPercentage": request.user.level_percentage,
            "avatar": request.user.avatar,
            "friendsRequests": get_friends_request_info(request.user.username),
            "friends": get_friends_info(request.user.username),
            "gameHistory": get_game_history(request.user),
            "skins": request.user.skins,
            "selectedSkin": request.user.selected_skin,
            "selectedSkinUrl": get_selected_skin_url(request.user.username),
        }
    )


@authenticated
def shoopa_shoop(request, *args, **kwargs):
    return JsonResponse(
        {
            "items": skins,
        }
    )


def get_selected_skin_url(username):
    user = User.objects.get(username=username)
    if user.selected_skin == "":
        return random.choice(DEFAULT_SKINS)

    skin = None
    for item in skins:
        if item["name"] == user.selected_skin:
            skin = item

    return random.choice(skin["images"])


@authenticated
def set_selected_skin(request, *args, **kwargs):
    skin = args[1].get("skin")

    if skin not in request.user.skins and skin != "default":
        return JsonResponse(
            {"error": f"User {request.user.username} does not possess the skin {skin}"}
        )
    if skin == "default":
        request.user.selected_skin = ""
    else:
        request.user.selected_skin = skin
    request.user.save()
    return JsonResponse({"success": True})


urls = [
    path("me", me),
    path("friends/", include(ponk.friends.urls)),
    path("private/", include(ponk.private.urls)),
    path("shop", shoopa_shoop),
    path("skin/<str:skin>", set_selected_skin),
    *money_api,
]
