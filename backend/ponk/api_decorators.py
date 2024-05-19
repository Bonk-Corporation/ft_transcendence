from django.http.response import JsonResponse


# TODO: move private.py's @private_api_auth here


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
