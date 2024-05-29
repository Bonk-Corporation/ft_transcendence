from django.urls import path
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import json


class Chat(WebsocketConsumer):
    def connect(self):
        self.accept()
        self.user = self.scope["user"]

        if self.user.is_authenticated:
            async_to_sync(self.channel_layer.group_add)("Lobby", self.channel_name)

            for friend in self.user.friends.all():
                users = sorted([friend.username, self.user.username])
                room_name = f"{users[0]}_{users[1]}"
                async_to_sync(self.channel_layer.group_add)(
                    room_name, self.channel_name
                )

            self.send(
                json.dumps(
                    dict(
                        type="friends",
                        friends=list(
                            map(lambda f: f.username, self.user.friends.all())
                        ),
                    )
                )
            )

    def disconnect(self, _):
        if self.user.is_authenticated:
            async_to_sync(self.channel_layer.group_discard)("Lobby", self.channel_name)

            for friend in self.user.friends.all():
                users = sorted([friend.username, self.user.username])
                room_name = f"{users[0]}_{users[1]}"
                async_to_sync(self.channel_layer.group_add)(
                    room_name, self.channel_name
                )

    def receive(self, text_data):
        message = json.loads(text_data)
        if "content" in message and "room" in message:
            message["author"] = self.user.username
            async_to_sync(self.channel_layer.group_send)(
                message["room"], {"type": "chat.message", "message": message}
            )

    def chat_message(self, event):
        message = event["message"]

        if message["content"].strip() == "":
            return

        # ew ew ew ew ew ew
        if "_" in message["room"]:
            user1, user2 = message["room"].split("_")
            if user1 != self.user.username:
                real_room = user1
            else:
                real_room = user2
        else:
            real_room = "Lobby"

        message["room"] = real_room
        if message["author"] != self.user.username:
            message["type"] = "message"
            self.send(text_data=json.dumps(message))


urls = [
    path("chat", Chat.as_asgi()),
]
