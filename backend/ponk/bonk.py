from django.urls import path
from django.http import JsonResponse
from ponk.api_decorators import authenticated
from ponk.models import User
from ponk.private import events

global_user_list = []
game_id = 0


@authenticated
def join_matchmaking_bonk(request, *args, **kwargs):
    for i in range(len(global_user_list)):
        if request.user.username == global_user_list[i]:
            return JsonResponse({"error": "You are already in this game"}, status=409)

    global_user_list.append(request.user.username)

    if len(global_user_list) == 2:
        events.append({"game_id": game_id, "users": global_user_list.copy()})
        game_id += 1
        global_user_list.clear()

    return JsonResponse({"success": True})


@authenticated
def leave_matchmaking_bonk(request, *args, **kwargs):
    for i in range(len(global_user_list)):
        if request.user.username == global_user_list[i]:
            global_user_list.remove(request.user.username)
            return JsonResponse({"success": True})

    return JsonResponse({"error": "You are not in this game"}, status=409)


urls = [
    path("join", join_matchmaking_bonk),
    path("leave", leave_matchmaking_bonk),
]
