from django.urls import path
from django.http.response import JsonResponse
from ponk.api_decorators import authenticated
from django.core.exceptions import ObjectDoesNotExist
from ponk.models import User
from dataclasses import dataclass
from typing import List


@dataclass
class Tournament:
    name: str
    users: List[User]
    host_user: User
    selected_game: str
    room_size: int
    private: bool


tournaments = {}


@authenticated
def new(request, *args, **kwargs):
    try:
        name = args[1].get("name")
        size = int(args[1].get("size"))
    except BaseException:
        return JsonResponse({"error": "Fatal error"}, status=400)

    if name == "":
        return JsonResponse({"error": "Room name cannot be empty"}, status=409)

    if size != 2 and size != 4 and size != 8:
        return JsonResponse({"error": "Room size can only be 2, 4 or 8"}, status=409)

    tournaments[request.user] = Tournament(
        name=name,
        users=[request.user],
        host_user=request.user,
        selected_game="pong",
        room_size=size,
        private=False,
    )
    request.user.current_room = request.user.username
    return JsonResponse({"success": True})


@authenticated
def set_to_private(request, *args, **kwargs):
    if request.user not in tournaments[request.user].host_user:
        return JsonResponse({"error": "You're not the tournament host"}, status=409)
    tournaments[request.user].private = True
    return JsonResponse({"success": True})


@authenticated
def set_to_public(request, *args, **kwargs):
    if request.user not in tournaments[request.user].host_user:
        return JsonResponse({"error": "You're not the tournament host"}, status=409)
    tournaments[request.user].private = False
    return JsonResponse({"success": True})


@authenticated
def join_room(request, *args, **kwargs):
    username = args[1].get("host")
    try:
        target_room_host = User.objects.get(username=username)
    except ObjectDoesNotExist:
        return JsonResponse(
            {"error": "Room does not exist".format(username)}, status=404
        )

    if target_room_host not in tournaments:
        return JsonResponse(
            {"error": "Room does not exist".format(username)}, status=404
        )

    if tournaments[target_room_host].private == True:
        if request.user not in target_room_host.friends:
            return JsonResponse(
                {"error": "This room is private".format(username)}, status=409
            )

    if len(tournament[request.user].users) == tournament[request.user].room_size:
        return JsonResponse({"error": "This room is full"}, status=409)

    tournament[target_room_host].users.append(request.user)
    request.user.current_room = target_room_host.username
    return JsonResponse({"success": True})


@authenticated
def leave_room(request, *args, **kwargs):
    if request.user.current_room == "":
        return JsonResponse({"error": "You're not part of a tournament"}, status=400)

    tournaments[User.objects.get(username=request.user.current_room)].users.remove(
        request.user
    )
    request.user.current_room = ""
    return JsonResponse({"success": True})


@authenticated
def kick_user(request, *args, **kwargs):
    if request.user.current_room == "":
        return JsonResponse({"error": "You're not part of a tournament"}, status=400)

    if (
        request.user
        not in tournaments[
            User.objects.get(username=request.user.current_room)
        ].host_user
    ):
        return JsonResponse({"error": "You're not the tournament host"}, status=409)

    username = args[1].get("target")
    try:
        target_user = User.objects.get(username=username)
    except ObjectDoesNotExist:
        return JsonResponse(
            {"error": "User {} does not exist".format(username)}, status=404
        )

    if target_user not in tournaments[request.user].users:
        return JsonResponse(
            {"error": "User {} is not in this tournament".format(username)}, status=409
        )

    tournaments[request.user].users.remove(target_user)
    target_user.current_room = ""
    return JsonResponse({"success": True})


@authenticated
def status(request, *args, **kwargs):
    if request.user in tournaments:
        tournament = tournaments[request.user]
        return JsonResponse(
            {
                "name": tournament.name,
                "host": tournament.host_user.username,
                "users": [
                    {
                        "username": user.username,
                        "level": user.level,
                    }
                    for user in tournament.users
                ],
                "selected_game": tournament.selected_game,
                "size": tournament.room_size,
                "private": tournament.private,
            }
        )
    return JsonResponse({"error": "You're not part of a tournament"}, status=400)


@authenticated
def get_all_tournaments_info(request, *args, **kwargs):
    tournaments_info = []

    for other_user in tournaments:
        if other_user in request.user.friends.all():
            tournament_info = {
                "room_name": tournaments[other_user].name,
                "host_avatar": tournaments[other_user].host_user.avatar,
                "players_number": len(tournaments[other_user].users),
            }
            tournaments_info.append(tournament_info)

    for other_user in tournaments:
        if other_user not in request.user.friends.all():
            tournament_info = {
                "room_name": tournaments[other_user].name,
                "host_avatar": tournaments[other_user].host_user.avatar,
                "players_number": len(tournaments[other_user].users),
            }
            tournaments_info.append(tournament_info)

    return JsonResponse({"data": tournaments_info})


urls = [
    path("status", status),  # get informations about current turnament
    path("get_all_tournaments", get_all_tournaments_info),
    path("set_to_public", set_to_public),
    path("set_to_private", set_to_private),
    path("join_room/<str:host>", join_room),
    path("leave_room", leave_room),
    path("new/<str:name>/<str:size>", new),
    path("kick_user/<str:target>", kick_user),
]
