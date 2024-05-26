from django.urls import path
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.core.exceptions import ObjectDoesNotExist
from ponk.api_decorators import authenticated
from ponk.models import User


@authenticated
def friend_request(request, *args, **kwargs):
    username = args[1].get("user")
    try:
        target_user = User.objects.get(username=username)
    except ObjectDoesNotExist:
        return JsonResponse(
            {"error": "User {} does not exist".format(username)}, status=404
        )

    if username == request.user.username:
        return JsonResponse(
            {"error": "You cannot send a friend request to yourself"}, status=409
        )

    if request.user in target_user.friend_requests.all():
        return JsonResponse(
            {"error": "You have already sent a friend request to {}".format(username)},
            status=409,
        )

    if target_user in request.user.friends.all():
        return JsonResponse(
            {"error": "{} is already in your friend list".format(username)}, status=409
        )

    target_user.friend_requests.add(request.user)
    return JsonResponse({"success": True})


@authenticated
def accept_friend_request(request, *args, **kwargs):
    username = args[1].get("user")
    try:
        target_user = User.objects.get(username=username)
    except ObjectDoesNotExist:
        return JsonResponse(
            {"error": "User {} does not exist".format(username)}, status=404
        )

    if target_user not in request.user.friend_requests.all():
        return JsonResponse(
            {"error": "{} has not sent you a friend request".format(username)},
            status=404,
        )

    if target_user in request.user.friends.all():
        return JsonResponse(
            {"error": "{} is already in your friend list".format(username)}, status=409
        )

    request.user.friends.add(target_user)
    request.user.friend_requests.remove(target_user)
    target_user.friend_requests.remove(request.user)
    return JsonResponse({"success": True})


@authenticated
def deny_friend_request(request, *args, **kwargs):
    username = args[1].get("user")
    try:
        target_user = User.objects.get(username=username)
    except ObjectDoesNotExist:
        return JsonResponse(
            {"error": "User {} does not exist".format(username)}, status=404
        )

    if target_user not in request.user.friend_requests.all():
        return JsonResponse(
            {"error": "{} has not sent you a friend request".format(username)},
            status=404,
        )

    request.user.friend_requests.remove(target_user)
    return JsonResponse({"success": True})


@authenticated
def remove_friend(request, *args, **kwargs):
    username = args[1].get("user")
    try:
        target_user = User.objects.get(username=username)
    except ObjectDoesNotExist:
        return JsonResponse(
            {"error": "User {} does not exist".format(username)}, status=404
        )

    if target_user not in request.user.friends.all():
        return JsonResponse(
            {"error": "{} is not in your friend list".format(username)}, status=404
        )

    request.user.friends.remove(target_user)
    return JsonResponse({"success": True})


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
            "last_online": friend.last_online,
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


urls = [
    path("send/<str:user>", friend_request),
    path("accept/<str:user>", accept_friend_request),
    path("deny/<str:user>", deny_friend_request),
    path("remove/<str:user>", remove_friend),
]
