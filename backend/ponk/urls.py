"""
URL configuration for ponk project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, re_path, include
from django.views.generic import TemplateView
from django_q.tasks import schedule
from django_q.models import Schedule
from .ping import ping
import ponk.chat
import ponk.auth
import ponk.api

default = lambda url: re_path(".*", url)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("auth/", include(ponk.auth.urls)),
    path("api/", include(ponk.api.urls)),
    path('ping/', ping, name='ping'),
    *ponk.chat.urls,
    default(TemplateView.as_view(template_name="index.html")),
]

from django_q.models import Schedule
Schedule.objects.create(
    func='ponk.tasks.check_user_activity',
    minutes=1,
    repeats=-1
)
