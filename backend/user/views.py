from django.http import HttpResponse, HttpResponseBadRequest
import json
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login


@csrf_exempt
def login_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return HttpResponse("Login efetuado com sucesso")
        else:
            return HttpResponseBadRequest("Usuário ou senha inválidos")
    return HttpResponseBadRequest("Método não permitido")
