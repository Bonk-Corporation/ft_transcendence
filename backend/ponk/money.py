from django.urls import path
from django.http.response import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from ponk.models import User
import stripe
import json
import sys
import os


stripe.api_key = os.environ["VITE_STRIPE_API_KEY"]
webhook_secret = os.environ["STRIPE_WEBHOOK_KEY"]
skins = json.load(open(os.path.dirname(os.path.realpath(__file__)) + "/skins.json"))


@csrf_exempt
def money_webhook(request, *args, **kwargs):
    sig = request.headers.get("Stripe-Signature", None)

    try:
        event = stripe.Webhook.construct_event(request.body, sig, webhook_secret)
    except BaseException:
        return JsonResponse(
            {
                "error": "rip",
            },
            status=400,
        )

    if event.type == "checkout.session.completed":
        data = event.data.object
        username_and_skin = data.client_reference_id

        if not username_and_skin or not "_" in username_and_skin:
            print(
                "client_reference_id is empty!! (I don't know who bought the skin)",
                file=sys.stderr,
            )
            return JsonResponse(
                {
                    "error": "empty client_reference_id",
                },
                status=400,
            )

        username_and_skin_raw = username_and_skin.split("_")
        username = username_and_skin_raw[0]
        skin = username_and_skin_raw[1]

        try:
            user = User.objects.get(username=username)
            for available_skin in skins:
                if available_skin["name"] == skin:
                    user.skins.append(skin)
                    user.save()
                    return JsonResponse({"success": True})

            return JsonResponse(
                {
                    "error": "unknown skin",
                },
                status=400,
            )

        except User.DoesNotExist:
            return JsonResponse(
                {
                    "error": "user does not exist",
                },
                status=400,
            )

    return JsonResponse(
        {
            "yeah yeah send me other events": True,
        }
    )


urls = [
    path("payments", money_webhook),
]
