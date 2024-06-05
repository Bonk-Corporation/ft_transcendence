from django.urls import path
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from ponk.api_decorators import private_api_auth
from ponk.api_decorators import authenticated
from ponk.models import User
from ponk.private import events

global_user_list = []
room_id = 1


@authenticated
def join_matchmaking_bonk(request, *args, **kwargs):
    global room_id
    for i in range(len(global_user_list)):
        if request.user.username == global_user_list[i]:
            return JsonResponse({"error": "You are already in this game"}, status=409)

    global_user_list.append(request.user.username)

    if len(global_user_list) == 2:
        events.append({"game_id": str(room_id), "users": global_user_list.copy()})
        room_id += 1
        global_user_list.clear()

    return JsonResponse({"success": True})


@csrf_exempt
@private_api_auth
def leave_matchmaking_bonk(request, *args, **kwargs):
    username = args[1].get("username")
    try:
        global_user_list.remove(username)
        return JsonResponse({"success": True})
    except ValueError:
        return JsonResponse({"error": "You are not in this game"}, status=409)


urls = [
    path("join", join_matchmaking_bonk),
    path("leave/<str:username>", leave_matchmaking_bonk),
]
