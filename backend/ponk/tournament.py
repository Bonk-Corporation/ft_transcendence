from django.urls import path
from django.http.response import JsonResponse
from ponk.api_decorators import authenticated
from django.core.exceptions import ObjectDoesNotExist
from ponk.models import User
from dataclasses import dataclass
from typing import List
import requests
import json
import os


@dataclass
class Tournament:
    name: str
    users: List[User]
    phases: List[List[User]]
    host_user: User
    selected_game: str
    room_size: int
    private: bool


tournaments = {}
rooms = {}


@authenticated
def new(request, *args, **kwargs):
    try:
        data = json.loads(request.body)
    except BaseException as e:
        print(e, file=sys.stderr)
        return JsonResponse(
            {
                "error": "Fatal error !",
            },
            status=400,
        )
    name = data["name"]
    size = int(data["size"])

    if name == "":
        return JsonResponse({"error": "Room name cannot be empty"}, status=409)

    if size not in [2, 4, 8]:
        return JsonResponse({"error": "Room size can only be 2, 4 or 8"}, status=409)

    if rooms.get(request.user):
        leave_room(request, *args, **kwargs)

    tournaments[request.user] = Tournament(
        name=name,
        users=[request.user],
        phases=[],
        host_user=request.user,
        selected_game="pong",
        room_size=size,
        private=False,
    )
    rooms[request.user] = request.user
    tournaments[request.user].phases.append(tournaments[request.user].users)
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
            {"error": "Room does not existt".format(username)}, status=404
        )

    if target_room_host not in tournaments:
        return JsonResponse(
            {"error": "Room does not exist".format(username)}, status=404
        )

    if target_room_host == request.user:
        return JsonResponse(
            {"error": "You cannot join your own room".format(username)}, status=409
        )

    if rooms.get(request.user):
        leave_room(request, *args, **kwargs)

    if (
        tournaments[target_room_host].private
        and request.user not in target_room_host.friends.all()
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
    rooms[request.user] = target_room_host
    return JsonResponse({"success": True})


@authenticated
def leave_room(request, *args, **kwargs):
    if not rooms.get(request.user) or not tournaments.get(rooms[request.user]):
        return JsonResponse({"error": "You're not part of a tournament"}, status=400)

    if rooms[request.user] == request.user:
        if len(tournaments[rooms[request.user]].users) != 1:
            next_host = tournaments[request.user].users[1]
            tournaments[request.user].users.remove(request.user)
            tournaments[next_host] = tournaments[request.user]
            tournaments.pop(request.user)
            del rooms[request.user]
            tournaments[next_host].host_user = next_host
            for user in tournaments[next_host].users:
                rooms[user] = next_host
            return JsonResponse({"success": True})

        else:
            tournaments.pop(request.user)
            del rooms[request.user]
            return JsonResponse({"success": True})

    tournaments[rooms[request.user]].users.remove(request.user)
    del rooms[request.user]
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

    if target_user == request.user:
        return JsonResponse({"error": "You cannot kick yourself"}, status=409)

    tournaments[request.user].users.remove(target_user)
    del rooms[target_user]
    return JsonResponse({"success": True})


@authenticated
def status(request, *args, **kwargs):
    if not rooms.get(request.user) or not tournaments.get(rooms[request.user]):
        return JsonResponse({"error": "You're not part of a tournament"}, status=400)

    room = rooms[request.user]

    tournament = tournaments[room]
    return JsonResponse(
        {
            "name": tournament.name,
            "host": tournament.host_user.username,
            "phases": [
                [
                    {
                        "avatar": user.avatar,
                        "username": user.username,
                        "level": user.level,
                    }
                    for user in tournament.users
                ]
                for i in tournament.phases
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
        if (
            other_user not in request.user.friends.all()
            and tournaments[other_user].private == False
            and tournaments[other_user].host_user != request.user
        ):
            tournament_info = {
                "room_name": tournaments[other_user].name,
                "host_avatar": tournaments[other_user].host_user.avatar,
                "players_number": len(tournaments[other_user].users),
                "host_name": tournaments[other_user].host_user.username,
            }
            tournaments_info.append(tournament_info)

    return JsonResponse({"data": tournaments_info})


@authenticated
def play(request, *args, **kwargs):
    if not tournaments.get(request.user):
        return JsonResponse({"error": "You're not the tournament host"}, status=409)

    users = tournaments[request.user].users

    if len(users) not in [2, 4, 8]:
        return JsonResponse(
            {"error": "You must be 2, 4 or 8 players to start a game"}, status=409
        )

    if tournaments[request.user].selected_game == "pong":
        url = "0.0.0.0:4210/rooms"
        data = []
        for i in range(0, len(users), 2):
            data.append([users[i].username, users[i + 1].username])
        headers = {
            "Content-Type": "application/json",
            "Authorization": os.environ["PRIVATE_API_TOKEN"],
        }
        response = requests.post(url, data=data, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        return JsonResponse({"success": True})

    # TODO handle if the selected_game is bonk


# TODO handle when a game end and handle when a tournament end

urls = [
    path("status", status),  # get informations about current turnament
    path("play", play),
    path("get_all_tournaments", get_all_tournaments_info),
    path("set_to_pong", set_to_pong),
    path("set_to_bonk", set_to_bonk),
    path("set_to_public", set_to_public),
    path("set_to_private", set_to_private),
    path("join_room/<str:host>", join_room),
    path("leave_room", leave_room),
    path("new", new),
    path("kick_user/<str:target>", kick_user),
]
