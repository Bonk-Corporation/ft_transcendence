from django.urls import path
from ponk.models import GameHistory, User
from django.http.response import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from ponk.api_decorators import private_api_auth
from ponk.tournament import game_ended
from ponk.tournament import rooms
import json
import sys
import os


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


def get_bonk_events(request, *args, **kwargs):
    try:
        last_event = BonkEvent.objects.earliest("created_at")
        last_event.delete()
        return JsonResponse({"game_id": last_event.game_id, "users": last_event.users})
    except BaseException as e:
        print(e, file=sys.stderr)
        return JsonResponse(
            {
                "error": "no events",
            },
            status=400,
        )


def set_bonk_events(request, *args, **kwargs):
    try:
        data = json.loads(request.body)

        BonkEvent(game_id=data["game_id"], users=data["users"]).save()

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


urls = [
    path("game_stats", game_stats),
    path("get_bonk_event", get_bonk_events),
    path("set_bonk_event", set_bonk_events),
]
