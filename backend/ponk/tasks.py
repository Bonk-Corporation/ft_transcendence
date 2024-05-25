from django_q.tasks import schedule
from django_q.models import Schedule
from django.utils import timezone
from datetime import timedelta
from .models import User

def check_user_activity():
    now = timezone.now()
    inactive_threshold = now - timedelta(minutes=1)
    User.objects.filter(is_online=True, last_activity__lt=inactive_threshold).update(is_online=False)
    print("check_user_activity function has been executed")
