from django.urls import path
from ponk.models import GameHistory, User
from django.http.response import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import sys
import os


def private_api_auth(original):
    def wrapper(request, *args, **kwargs):
        auth = request.headers.get("Authorization")
        if auth != os.environ["PRIVATE_API_TOKEN"]:
            return JsonResponse(
                {
                    "error": "no",
                },
                status=403,
            )
        return original(request, args, kwargs)

    return wrapper


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
