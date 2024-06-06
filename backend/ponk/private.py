from django.urls import path
from ponk.models import GameHistory, User
from django.http.response import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from ponk.api_decorators import private_api_auth
from ponk.tournament import game_ended
from ponk.tournament import del_room
from ponk.tournament import rooms
from ponk.utils import get_selected_skin_url
import json
import sys
import os
import secrets


events = []
tokens = {}


@csrf_exempt
@private_api_auth
def game_stats(request, *args, **kwargs):
    try:
        data = json.loads(request.body)
        score_user = data["score"][0]
        score_opponent = data["score"][1]

        win = score_user > score_opponent
        multiplier = 10 if win else 1

        if score_user == 4 and score_opponent == 1:
            multiplier = 17.25

        try:
            xp = (
                max(score_user, score_opponent) / min(score_user, score_opponent)
            ) * multiplier
        except ZeroDivisionError:
            xp = (max(score_user, score_opponent) / 1) * multiplier + 5

        user = User.objects.get(username=data["player"])
        user.level_percentage += xp
        if user.level_percentage >= 100:
            user.level += user.level_percentage // 100
            user.level_percentage = user.level_percentage % 100
        user.save()

        del_room(user)

        if win and user in rooms:
            game_ended(user)

        GameHistory(
            user=user, game=data["game"], score=data["score"], win=win, xp=xp
        ).save()

        return JsonResponse(
            {
                "success": True,
            }
        )
    except BaseException as e:
        print(e, file=sys.stderr)
        return JsonResponse(
            {
                "error": "missing fields!!!!",
            },
            status=400,
        )


@csrf_exempt
@private_api_auth
def get_bonk_events(request, *args, **kwargs):
    if len(events):
        return JsonResponse(
            events.pop(0),
        )
    return JsonResponse(
        {
            "error": "no events",
        },
        status=400,
    )


@csrf_exempt
@private_api_auth
def set_bonk_events(request, *args, **kwargs):
    try:
        data = json.loads(request.body)

        events.append({"game_id": data["game_id"], "users": data["users"]})

        return JsonResponse(
            {
                "success": True,
            },
        )
    except BaseException as e:
        print(e, file=sys.stderr)
        return JsonResponse(
            {
                "error": "missing fields!!!!",
            },
            status=400,
        )


@csrf_exempt
@private_api_auth
def get_player_token(request, *args, **kwargs):
    try:
        token = args[1].get("token")
        username = {value: key for key, value in tokens.items()}.get(token)
        user = User.objects.get(username=username)
        return JsonResponse(
            {
                "name": user.username,
                "skin": get_selected_skin_url(user.username),
            }
        )
    except BaseException as e:
        print(e, file=sys.stderr)
        return JsonResponse(
            {
                "error": "Invalid token",
            },
            status=400,
        )


urls = [
    path("game_stats", game_stats),
    path("get_bonk_event", get_bonk_events),
    path("set_bonk_event", set_bonk_events),
    path("get_bonk_player/<str:token>", get_player_token),
]
