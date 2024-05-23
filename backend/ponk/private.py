from django.urls import path
from ponk.models import GameHistory, User
from django.http.response import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from ponk.api_decorators import private_api_auth
import json
import sys
import os


@csrf_exempt
@private_api_auth
def game_stats(request, *args, **kwargs):
    try:
        data = json.loads(request.body)

        GameHistory(
            user=User.objects.get(username=data["user"]),
            game=data["game"],
            score=data["score"],
            win=data["win"],
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


urls = [
    path("game_stats", game_stats),
]
