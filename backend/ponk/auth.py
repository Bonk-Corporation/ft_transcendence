from django.urls import path
from django.shortcuts import redirect
from django.http.response import (
    HttpResponse,
    HttpResponseBadRequest,
    HttpResponseServerError,
    JsonResponse,
)
from django.contrib.auth.backends import BaseBackend
from django.contrib.auth import (
    authenticate,
    login,
    logout,
)
from ponk.ftapi import oauth_token, user_info, APIException
from ponk.models import (
    User,
    AuthMethod,
)
import json
import sys


class FtAuthBackend(BaseBackend):
    def authenticate(self, request, code):
        try:
            token = oauth_token(code)
            info = user_info(token)

            try:
                while True:
                    user = User.objects.get(username=info.login)
                    print(f"GET: {user}")
                    if user.auth_method == AuthMethod.FT:
                        break
                    info.login = f"{info.login}_"
            except User.DoesNotExist:
                user = User.objects.create_user(
                    username=info.login, avatar=info.avatar, auth_method=AuthMethod.FT
                )
                print(f"CREATE: {user}")
            return user
        except APIException:
            return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None


def oauth_login(request, *args, **kwargs):
    code = request.GET.get("code")
    if not code:
        return HttpResponseBadRequest()

    try:
        user = authenticate(request, code=code)
        if not user:
            return HttpResponseServerError()
        login(request, user, backend="ponk.auth.FtAuthBackend")
        return redirect("/play")
    except APIException:
        return HttpResponseServerError()


def basic_login(request, *args, **kwargs):
    try:
        data = json.loads(request.body)
        user = authenticate(username=data["username"], password=data["password"])

        if not user:
            return JsonResponse(
                {
                    "error": "invalid username or password !",
                },
                status=403,
            )
        login(request, user, backend="django.contrib.auth.backends.ModelBackend")
        return JsonResponse(
            {
                "success": True,
            }
        )
    except BaseException as e:
        print(e, file=sys.stderr)
        return JsonResponse(
            {
                "error": "fatal error !",
            },
            status=400,
        )


def basic_register(request, *args, **kwargs):
    try:
        data = json.loads(request.body)

        try:
            user = User.objects.get(username=data["username"])
        except User.DoesNotExist:
            user = User.objects.create_user(
                username=data["username"],
                password=data["password"],
                auth_method=AuthMethod.BASIC,
            )
            login(request, user, backend="django.contrib.auth.backends.ModelBackend")
            return JsonResponse(
                {
                    "success": True,
                }
            )
        return JsonResponse(
            {
                "error": "user already exist !",
            },
            status=403,
        )
    except BaseException as e:
        print(e, file=sys.stderr)
        return JsonResponse(
            {
                "error": "fatal error !",
            },
            status=400,
        )


def basic_logout(request, *args, **kwargs):
    try:
        logout(request)
        return JsonResponse(
            {
                "success": True,
            }
        )
    except BaseException as e:
        print(e, file=sys.stderr)
        return JsonResponse(
            {
                "error": "fatal error !",
            },
            status=400,
        )


urls = [
    path("42", oauth_login),
    path("login", basic_login),
    path("register", basic_register),
    path("logout", basic_logout),
]
