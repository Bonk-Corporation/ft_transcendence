from django.urls import path, include
from django.http.response import JsonResponse
from ponk.api_decorators import authenticated
from ponk.money import urls as money_api, skins
import ponk.friends
import ponk.tournament
from ponk.models import User, GameHistory, Image
from ponk.friends import get_friends_info
from ponk.friends import get_friends_request_info
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from ponk.money import skins
from django.utils import timezone
from ponk.tournament import rooms
from ponk.utils import get_selected_skin_url
from ponk.private import tokens
import ponk.private
import json
import os
import secrets
import random

DEFAULT_SKINS = [
    "/assets/skins/red.png",
    "/assets/skins/green.png",
    "/assets/skins/blue.png",
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
            "playing": request.user in rooms,
        }
    )


@authenticated
def shoopa_shoop(request, *args, **kwargs):
    return JsonResponse(
        {
            "items": skins,
        }
    )


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


@authenticated
def set_new_profile(request, *args, **kwargs):
    try:
        data = json.loads(request.body)

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
def set_player_token(request, *args, **kwargs):
    try:
        tokens.update({request.user.username: secrets.token_urlsafe(32)})
        return JsonResponse(
            {
                "success": tokens[request.user.username],
            },
            status=200,
        )
    except BaseException as e:
        return JsonResponse(
            {
                "error": "Invalid user",
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


@authenticated
def delete_user(request, *args, **kwargs):
    try:
        request.user.delete()
        return JsonResponse(
            {
                "success": True,
            },
        )
    except BaseException as e:
        return JsonResponse(
            {
                "error": "Fatal error",
            },
            status=400,
        )


def upload_image(request, *args, **kwargs):
    if request.method == "POST":
        img = Image(image=request.FILES["image"])
        img.save()
        request.user.avatar = img.image.url
        request.user.save()
        return JsonResponse({"success": True})
    return JsonResponse({"error": "Fatal error"})


urls = [
    path("me", me),
    path("friends/", include(ponk.friends.urls)),
    path("private/", include(ponk.private.urls)),
    path("tournament/", include(ponk.tournament.urls)),
    path("shop", shoopa_shoop),
    path("skin/<str:skin>", set_selected_skin),
    path("ping", ping),
    path("update_profile", set_new_profile),
    path("citation", get_random_citation),
    path("delete_myself", delete_user),
    path("upload", upload_image),
    path("set_token", set_player_token),
    *money_api,
]
