from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from ponk.api_decorators import authenticated

@csrf_exempt
@authenticated
def ping(request, *args, **kwargs):
    if request.method == 'POST':
        user = request.user
        user.is_online = True
        user.last_activity = timezone.now()
        user.save()
        return JsonResponse({'status': 'success'})
    return JsonResponse({'error': 'Invalid request'}, status=400)
