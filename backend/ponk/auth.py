from django.urls import path
from django.shortcuts import redirect
from django.http.response import (
    HttpResponse,
    HttpResponseBadRequest,
    HttpResponseServerError,
)
from django.contrib.auth.backends import BaseBackend
from django.contrib.auth import authenticate, login
from ponk.ftapi import oauth_token, user_info, APIException
from ponk.models import User


class FtAuthBackend(BaseBackend):
    def authenticate(self, request, code):
        try:
            token = oauth_token(code)
            info = user_info(token)

            try:
                user = User.objects.get(username=info.login)
            except User.DoesNotExist:
                user = User(username=info.login, level=0, level_percentage=0)

                user.save()
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

        login(request, user)
        return redirect("/")
    except APIException:
        return HttpResponseServerError()


urls = [
    path("42", oauth_login),
]
