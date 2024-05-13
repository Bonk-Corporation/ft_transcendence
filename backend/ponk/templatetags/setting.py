from django import template
from django.conf import settings as django_settings
from django.utils.safestring import mark_safe


class UnknownSetting(BaseException):
    pass


register = template.Library()


@register.simple_tag
@mark_safe
def settings():
    return f'<settings style="display: none">'


@register.simple_tag
@mark_safe
def endsettings():
    return f"</settings>"


@register.simple_tag
@mark_safe
def setting(name):
    if not hasattr(django_settings, name):
        raise UnknownSetting()
    value = getattr(django_settings, name)
    return f'<setting name="{name}">{value}</setting>'
