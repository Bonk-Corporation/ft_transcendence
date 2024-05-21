from django.urls import path, include
from django.http.response import JsonResponse
from ponk.api_decorators import authenticated
from ponk.money import urls as money_api, skins
import ponk.friends
from ponk.models import User


def get_friends_info(username):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return {"error": f"User {username} does not exist"}

    friends = user.friends.all()
    friends_info = []

    for friend in friends:
        friend_info = {
            "name": friend.username,
            "avatar": friend.avatar,
            "level": friend.level,
        }
        friends_info.append(friend_info)

    return friends_info


def get_friends_request_info(username):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return {"error": f"User {username} does not exist"}

    friends = user.friend_requests.all()
    friends_info = []

    for friend in friends:
        friend_info = {
            "name": friend.username,
            "avatar": friend.avatar,
            "level": friend.level,
        }
        friends_info.append(friend_info)

    return friends_info


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
            "gameHistory": [],
            "skins": ["Jesus", "Dictionnaire"],
            "selectedSkin": "Jesus",
        }
    )


@authenticated
def shoopa_shoop(request, *args, **kwargs):
    return JsonResponse(
        {
            "items": skins,
        }
    )


urls = [
    path("me", me),
    path("friends/", include(ponk.friends.urls)),
    path("shop", shoopa_shoop),
    *money_api,
]
