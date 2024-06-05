from ponk.models import User
import random

DEFAULT_SKINS = [
    "http://localhost:8000/assets/skins/red.png",
    "http://localhost:8000/assets/skins/green.png",
    "http://localhost:8000/assets/skins/blue.png",
]


def get_selected_skin_url(username):
    user = User.objects.get(username=username)
    if user.selected_skin == "":
        return random.choice(DEFAULT_SKINS)

    skin = None
    for item in skins:
        if item["name"] == user.selected_skin:
            skin = item

    return random.choice(skin["images"])
