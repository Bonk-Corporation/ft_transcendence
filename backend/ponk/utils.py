from ponk.models import User
import random

DEFAULT_SKINS = [
    "https://t4.ftcdn.net/jpg/03/03/40/19/360_F_303401956_ufTeSp9EX62zQnJnbed9Q0kEgqaKKL44.jpg",
    "https://htmlcolorcodes.com/assets/images/colors/bright-green-color-solid-background-1920x1080.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Solid_blue.svg/1024px-Solid_blue.svg.png",
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
