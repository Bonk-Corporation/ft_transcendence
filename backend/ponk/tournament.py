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
    if str == "":
        return JsonResponse({"error": "Room name cannot be empty"}, status=409)

    if kwargs.size != 2 or kwargs.size != 4 or kwargs.size != 8:
        return JsonResponse({"error": "Room size can only be 2, 4 or 8"}, status=409)

    if kwargs.game.lower() != "bonk" or kwargs.game.lower() != "pong":
        return JsonResponse({"error": "This game does not exist"}, status=409)

    if request.user in tournaments:
        tournaments.remove(request.user)
    tournaments[request.user] = Tournament(
        users=[request.user],
        host_user=request.user,
        selected_game=kwargs.game.lower(),
        room_size=int(kwargs.size),
        private=False,
    )
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
def add_user(request, *args, **kwargs):
    if len(tournament[request.user].users) == tournament[request.user].room_size:
        return JsonResponse({"error": "This room is full"}, status=409)

    username = args[1].get("host")
    try:
        target_room_host = User.objects.get(username=username)
    except ObjectDoesNotExist:
        return JsonResponse(
            {"error": "User {} does not exist".format(username)}, status=404
        )

    if tournaments[target_room_host].private == True:
        if request.user not in target_room_host.friends:
            return JsonResponse(
                {"error": "This game is private".format(username)}, status=404
            )

    tournament[target_room_host].users.append(request.user)
    tournament[request.user] = tournament[target_room_host]
    return JsonResponse({"success": True})


@authenticated
def kick_user(request, *args, **kwargs):
    if request.user not in tournaments[request.user].host_user:
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

    tournaments.remove(target_user)
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

    for other_user in tournaments.all():
        if other_user in request.user.friends:
            tournament_info = {
                "room_name": tournaments[other_user].name,
                "host_avatar": tournaments[other_user].host_user.avatar,
                "players_number": len(tournaments[other_user].users),
            }
            tournaments_info.append(tournament_info)

    for other_user in tournaments.all():
        if other_user not in request.user.friends:
            tournament_info = {
                "room_name": tournaments[other_user].name,
                "host_avatar": tournaments[other_user].host_user.avatar,
                "players_number": len(tournaments[other_user].users),
            }
            tournaments_info.append(tournament_info)

    return tournaments_info


urls = [
    path("status", status),
    path("get_all_tournaments", get_all_tournaments_info),
    path("set_to_public", set_to_public),
    path("set_to_private", set_to_private),
    path("add_user/<str:host>", add_user),
    path("new/<str:game>/<str:size>", new),
    path("kick_user/<str:target>", kick_user),
]
