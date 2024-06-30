from django.http import HttpResponse, HttpResponseBadRequest
import json
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login
from rest_framework.authtoken.models import Token


@csrf_exempt
def login_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return HttpResponse(
                json.dumps(
                    {
                        "token": token.key,
                        "user": {
                            "id": user.id,
                            "username": user.username,
                            "email": user.email,
                        },
                    }
                ),
                content_type="application/json",
            )
        else:
            return HttpResponseBadRequest("Usuário ou senha inválidos")
    return HttpResponseBadRequest("Método não permitido")
