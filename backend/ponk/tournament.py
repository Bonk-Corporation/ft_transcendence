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

    if size not in [2, 4, 8]:
        return JsonResponse({"error": "Room size can only be 2, 4 or 8"}, status=409)

    tournaments[request.user] = Tournament(
        name=name,
        users=[request.user],
        host_user=request.user,
        selected_game="pong",
        room_size=size,
        private=False,
    )
    request.user.current_room = request.user
    request.user.save()
    return JsonResponse({"success": True})


@authenticated
def set_to_pong(request, *args, **kwargs):
    if not tournaments.get(request.user):
        return JsonResponse({"error": "You're not the tournament host"}, status=409)
    tournaments[request.user].selected_game = "pong"
    return JsonResponse({"success": True})


@authenticated
def set_to_bonk(request, *args, **kwargs):
    if not tournaments.get(request.user):
        return JsonResponse({"error": "You're not the tournament host"}, status=409)
    tournaments[request.user].selected_game = "bonk"
    return JsonResponse({"success": True})


@authenticated
def set_to_private(request, *args, **kwargs):
    if not tournaments.get(request.user):
        return JsonResponse({"error": "You're not the tournament host"}, status=409)
    tournaments[request.user].private = True
    return JsonResponse({"success": True})


@authenticated
def set_to_public(request, *args, **kwargs):
    if not tournaments.get(request.user):
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

    if (
        tournaments[target_room_host].private
        and request.user not in target_room_host.friends
    ):
        return JsonResponse(
            {"error": "This room is private".format(username)}, status=409
        )

    if (
        len(tournaments[target_room_host].users)
        == tournaments[target_room_host].room_size
    ):
        return JsonResponse({"error": "This room is full"}, status=409)

    tournaments[target_room_host].users.append(request.user)
    request.user.current_room = target_room_host
    request.user.save()
    return JsonResponse({"success": True})


@authenticated
def leave_room(request, *args, **kwargs):
    if request.user.current_room == None:
        return JsonResponse({"error": "You're not part of a tournament"}, status=400)

    if request.user.current_room == request.user:
        if len(tournaments[request.user.current_room].users != 1):
            tournaments[request.user].host_user = User.objects.get(
                username=tournaments[request.user.current_room].users[1]
            )
        else:
            tournaments.pop(request.user)
            return JsonResponse({"success": True})

    tournaments[request.user.current_room].users.remove(request.user)
    request.user.current_room = None
    request.user.save()
    return JsonResponse({"success": True})


@authenticated
def kick_user(request, *args, **kwargs):
    if not tournaments.get(request.user):
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
    target_user.save()
    return JsonResponse({"success": True})


@authenticated
def status(request, *args, **kwargs):
    if request.user.current_room == None:
        return JsonResponse({"error": "You're not part of a tournament"}, status=400)

    room = request.user.current_room

    tournament = tournaments[room]
    return JsonResponse(
        {
            "name": tournament.name,
            "host": tournament.host_user.username,
            "users": [
                {
                    "avatar": user.avatar,
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


@authenticated
def get_all_tournaments_info(request, *args, **kwargs):
    tournaments_info = []

    for other_user in tournaments:
        if other_user in request.user.friends.all():
            tournament_info = {
                "room_name": tournaments[other_user].name,
                "host_avatar": tournaments[other_user].host_user.avatar,
                "players_number": len(tournaments[other_user].users),
                "host_name": tournaments[other_user].host_user.username,
            }
            tournaments_info.append(tournament_info)

    for other_user in tournaments:
        if other_user not in request.user.friends.all():
            tournament_info = {
                "room_name": tournaments[other_user].name,
                "host_avatar": tournaments[other_user].host_user.avatar,
                "players_number": len(tournaments[other_user].users),
                "host_name": tournaments[other_user].host_user.username,
            }
            tournaments_info.append(tournament_info)

    return JsonResponse({"data": tournaments_info})


def play(request, *args, **kwargs):
    if not tournaments.get(request.user):
        return JsonResponse({"error": "You're not the tournament host"}, status=409)

    users = tournaments[request.user].users

    if len(users) not in [2, 4, 8]:
        return JsonResponse(
            {"error": "You must be 2, 4 or 8 players to start a game"}, status=409
        )

    if tournaments[request.user].selected_game == "pong":
        games = []
        for i in range(0, len(users), 2):
            games.append([users[i].username, users[i + 1].username])
        return JsonResponse({"games": games})

    # TODO handle if the selected_game is bonk


# TODO handle when a game end and handle when a tournament end

urls = [
    path("status", status),  # get informations about current turnament
    path("get_all_tournaments", get_all_tournaments_info),
    path("set_to_pong", set_to_pong),
    path("set_to_bonk", set_to_bonk),
    path("set_to_public", set_to_public),
    path("set_to_private", set_to_private),
    path("join_room/<str:host>", join_room),
    path("leave_room", leave_room),
    path("new/<str:name>/<str:size>", new),
    path("kick_user/<str:target>", kick_user),
]
