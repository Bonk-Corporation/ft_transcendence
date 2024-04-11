from django.conf import settings
from dataclasses import dataclass
import requests


class APIException(BaseException):
    pass


BadStatusCodeException = APIException("Non-OK status code in response")


def oauth_token(code):
    req = requests.post(
        f"{settings.API_URL}/oauth/token",
        data={
            "grant_type": "authorization_code",
            "client_id": settings.CLIENT_ID,
            "client_secret": settings.CLIENT_SECRET,
            "redirect_uri": settings.REDIRECT_URI,
            "code": code,
        },
    )

    if req.status_code != 200:
        raise BadStatusCodeException

    res = req.json()
    if not "access_token" in res:
        return APIException("Invalid JSON response")

    return res["access_token"]


@dataclass
class FtUser:
    login: str
    display_name: str

    @classmethod
    def from_json(klass, data):
        if not "login" in data or not "displayname" in data:
            raise APIException("Invalid /v2/me response")

        return klass(login=data["login"], display_name=data["displayname"])


def user_info(token):
    req = requests.get(
        f"{settings.API_URL}/v2/me", headers={"Authorization": f"Bearer {token}"}
    )

    if req.status_code != 200:
        raise BadStatusCodeException

    return FtUser.from_json(req.json())
