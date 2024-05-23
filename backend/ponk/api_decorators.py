from django.http.response import JsonResponse
import os


def authenticated(endpoint):
    def wrapper(request, *args, **kwargs):
        if request.user.is_authenticated:
            return endpoint(request, args, kwargs)
        return JsonResponse(
            {
                "error": "You need to be logged in",
            },
            status=401,
        )

    return wrapper


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
