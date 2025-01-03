from django.http import JsonResponse, HttpResponseBadRequest
import json
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated


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
            response = JsonResponse(
                {
                    "token": token.key,
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                    },
                }
            )
            response.set_cookie(
                key="currentUser",
                value=token.key,
                samesite="Lax",
                secure=True,
            )
            return response
        else:
            return HttpResponseBadRequest("Usuário ou senha inválidos")
    return HttpResponseBadRequest("Método não permitido")


@csrf_exempt
def logout_view(request):
    if request.method == "POST":
        logout(request)
        response = JsonResponse({"success": "Logout realizado com sucesso"})
        response.delete_cookie("currentUser")
        return response
    else:
        return HttpResponseBadRequest("Método não permitido")


@csrf_exempt
def register(request):

    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        if not (username and email and password):
            return HttpResponseBadRequest("Todos os campos são obrigatórios")

        try:
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
            )

            login(
                request,
                user,
            )

            token, created = Token.objects.get_or_create(user=user)

            response = JsonResponse(
                {"success": "Usuário cadastrado e logado com sucesso"}
            )

            response.set_cookie(
                key="currentUser",
                value=token.key,
                samesite="Lax",
                secure=True,
            )
            return response
        except Exception as e:
            return HttpResponseBadRequest(f"Erro ao cadastrar usuário: {str(e)}")
    else:
        return HttpResponseBadRequest("Método não permitido")


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user(request):
    user = request.user
    return JsonResponse(
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "name": user.first_name,
        }
    )
