from django.urls import path, include
from django.http.response import JsonResponse
from ponk.api_decorators import authenticated
from ponk.money import urls as money_api, skins
import ponk.friends
from ponk.models import User, GameHistory
from ponk.friends import get_friends_info
from ponk.friends import get_friends_request_info
import ponk.private


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


urls = [
    path("me", me),
    path("friends/", include(ponk.friends.urls)),
    path("private/", include(ponk.private.urls)),
    path("shop", shoopa_shoop),
    path("skin/<str:skin>", set_selected_skin),
    *money_api,
]
