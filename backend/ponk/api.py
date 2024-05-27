from django.urls import path, include
from django.http.response import JsonResponse
from ponk.api_decorators import authenticated
from ponk.money import urls as money_api, skins
import ponk.friends
from ponk.models import User, GameHistory
from ponk.friends import get_friends_info
from ponk.friends import get_friends_request_info
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from ponk.money import skins
from django.utils import timezone
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


@authenticated
def ping(request, *args, **kwargs):
    request.user.last_online = timezone.now()
    request.user.save()
    return JsonResponse({"success": True})


def set_new_profile(request, *args, **kwargs):
    try:
        data = json.loads(request.body)

        print(data)
        if "citation" in data:
            if len(data["citation"]) > 256:
                return JsonResponse(
                    {
                        "error": "Too long citation",
                    },
                    status=400,
                )
            request.user.citation = data["citation"]
            request.user.save()
        if "password" in data:
            validate_password(data["password"])
            request.user.set_password(data["password"])
            request.user.save()
        if not "citation" in data and not "password" in data:
            return JsonResponse(
                {
                    "error": "missing fields!!!!",
                },
                status=400,
            )
        return JsonResponse({"success": True})
    except ValidationError as e:
        return JsonResponse(
            {
                "error": e.messages[0],
            },
            status=403,
        )
    except BaseException as e:
        return JsonResponse(
            {
                "error": "Fatal error",
            },
            status=400,
        )


@authenticated
def get_random_citation(request, *args, **kwargs):
    users = User.objects.exclude(citation__exact="")
    if not len(users):
        return JsonResponse(
            {
                "error": "Nobody published a citation yet.",
            }
        )
    citation = random.choice(users)
    return JsonResponse({"citation": citation.citation, "username": citation.username})


urls = [
    path("me", me),
    path("friends/", include(ponk.friends.urls)),
    path("private/", include(ponk.private.urls)),
    path("shop", shoopa_shoop),
    path("skin/<str:skin>", set_selected_skin),
    path("ping", ping),
    path("update_profile", set_new_profile),
    path("citation", get_random_citation),
    *money_api,
]
