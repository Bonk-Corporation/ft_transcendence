from django.urls import path
from django.shortcuts import redirect
from django.http.response import (
    HttpResponse,
    HttpResponseBadRequest,
    HttpResponseServerError,
    JsonResponse,
)
from django.contrib.auth.backends import BaseBackend
from django.utils.regex_helper import _lazy_re_compile
from django.contrib.auth import (
    authenticate,
    login,
    logout,
)
from django.contrib.auth.password_validation import validate_password
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError
from ponk.ftapi import oauth_token, user_info, APIException
from ponk.models import (
    User,
    AuthMethod,
)
import json
import sys


def validate_username(username):
    alpha_symbol = _lazy_re_compile(r"^[a-zA-Z0-9-+@!#]+\Z")
    validate_alpha_symbol = RegexValidator(
        alpha_symbol,
        "Username can only contain letters, numbers or -+@!#",
        "invalid",
    )
    validate_alpha_symbol(username)
    if username == "Lobby":
        raise ValidationError(
            "Lobby is a invalid username",
            params={"value": username},
        )


class FtAuthBackend(BaseBackend):
    def authenticate(self, request, code):
        try:
            token = oauth_token(code)
            info = user_info(token)
            base_username = info.login

            try:
                num = 0
                while True:
                    num += 1
                    user = User.objects.get(username=info.login)
                    print(f"GET: {user}")
                    if user.auth_method == AuthMethod.FT:
                        break
                    info.login = f"{base_username}{num}"
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
                    "error": "Invalid username or password !",
                },
                status=403,
            )
        login(request, user, backend="django.contrib.auth.backends.ModelBackend")
        return JsonResponse(
            {
                "success": True,
            },
            status=200,
        )
    except BaseException as e:
        print(e, file=sys.stderr)
        return JsonResponse(
            {
                "error": "Fatal error !",
            },
            status=400,
        )


def basic_register(request, *args, **kwargs):
    try:
        data = json.loads(request.body)

        try:
            user = User.objects.get(username=data["username"])
        except User.DoesNotExist:
            validate_username(data["username"])
            validate_password(data["password"])
            user = User.objects.create_user(
                username=data["username"],
                password=data["password"],
                auth_method=AuthMethod.BASIC,
            )
            login(request, user, backend="django.contrib.auth.backends.ModelBackend")
            return JsonResponse(
                {
                    "success": True,
                },
                status=200,
            )
        return JsonResponse(
            {
                "error": "User already exist !",
            },
            status=409,
        )
    except ValidationError as e:
        return JsonResponse(
            {
                "error": e.messages[0],
            },
            status=403,
        )
    except BaseException as e:
        print(e, file=sys.stderr)
        return JsonResponse(
            {
                "error": "Fatal error !",
            },
            status=400,
        )


def basic_logout(request, *args, **kwargs):
    try:
        logout(request)
        return JsonResponse(
            {
                "success": True,
            },
            status=200,
        )
    except BaseException as e:
        print(e, file=sys.stderr)
        return JsonResponse(
            {
                "error": "Fatal error !",
            },
            status=400,
        )


urls = [
    path("42", oauth_login),
    path("login", basic_login),
    path("register", basic_register),
    path("logout", basic_logout),
]
