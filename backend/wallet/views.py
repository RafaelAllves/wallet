from django.shortcuts import render
from django.http import JsonResponse
from app.models import AssetPrice, Asset
from wallet.models import AssetConsolidatedValue, Order
from dateutil.relativedelta import relativedelta
from django.utils import timezone
from .models import Order
import pandas as pd
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
import json


def position(request):
    user = User.objects.get()

    # bypass as it does not work for fixed income yet
    orders = Order.objects.filter(user=user).exclude(asset_type="RF")
    assets = {}
    asset_classes = {}
    for order in orders:
        asset_name = order.name
        volume = order.volume
        cost = order.price

        if asset_name in assets:
            assets[asset_name]["volume"] += int(volume)
            assets[asset_name]["cost"] += cost * int(volume)
        else:
            latest_price = AssetPrice.objects.filter(ticker=asset_name).last()
            asset = Asset.objects.get(ticker=asset_name)
            assets[asset_name] = {
                "name": asset_name,
                "asset_class": asset.asset_class,
                "category": asset.category,
                "sub_category": asset.sub_category,
                "volume": int(volume),
                "cost": cost * int(volume),
                "price": latest_price.close if latest_price else None,
            }

        if assets[asset_name]["asset_class"] in asset_classes:
            asset_classes[assets[asset_name]["asset_class"]]["value"] += (
                int(volume) * assets[asset_name]["price"]
            )
        else:
            asset_classes[assets[asset_name]["asset_class"]] = {
                "value": (assets[asset_name]["price"] * int(volume))
            }

    df = pd.DataFrame(assets.values())

    return JsonResponse(
        {"assets": df.values.tolist(), "asset_classes": asset_classes}, safe=False
    )


def position_history(request):

    ticker = request.GET.get("ticker")
    asset_type = request.GET.get("class")
    user = User.objects.get()
    asset_consolidated_values = AssetConsolidatedValue.objects.filter(user=user)

    if ticker:
        asset_consolidated_values = asset_consolidated_values.filter(
            name=ticker.replace("-", " ").upper()
        )
    elif asset_type:
        asset_consolidated_values = asset_consolidated_values.filter(
            asset_type=asset_type.upper()
        )

    df = pd.DataFrame(asset_consolidated_values.values())
    df = df[["date", "value", "invested", "volume"]]
    df["date"] = pd.to_datetime(df["date"])

    df["value_volume"] = df["value"] * df["volume"]
    df["invested_volume"] = df["invested"] * df["volume"]
    grouped = (
        df.groupby("date")
        .agg({"value_volume": "sum", "invested_volume": "sum"})
        .reset_index()
    )

    grouped["date"] = grouped["date"].dt.strftime("%d/%m/%Y")
    grouped["value_volume"] = grouped["value_volume"].astype(float)
    grouped["invested_volume"] = grouped["invested_volume"].astype(float)

    return JsonResponse(
        {
            "labels": grouped["date"].values.tolist(),
            "values": grouped["value_volume"].values.tolist(),
            "invested": grouped["invested_volume"].values.tolist(),
        },
        safe=False,
    )


def orders(request):
    ticker = request.GET.get("ticker")
    orders = Order.objects.filter()

    if ticker:
        orders = orders.filter(name=ticker.upper())

    df = pd.DataFrame(orders.values())
    df["timestamp"] = pd.to_datetime(df["date"]).apply(lambda x: x.timestamp() * 1000)
    df["price"] = df["price"].astype(float)
    df["volume"] = df["volume"].astype(int)
    df = df.sort_values(by="timestamp", ascending=False)
    return JsonResponse(df.values.tolist(), safe=False)


@csrf_exempt  # Use this decorator to disable CSRF protection for demonstration purposes.
def order(request, id=None):
    user = User.objects.get()
    if request.method == "POST":
        try:

            data = json.loads(request.body.decode("utf-8"))

            if data.get("assetType") == "RF":
                order = Order(
                    name=data.get("name"),
                    broker=data.get("broker"),
                    asset_type=data.get("assetType"),
                    order_type=data.get("orderType"),
                    date=data.get("date"),
                    price=data.get("price"),
                    volume=data.get("volume"),
                    description=data.get("description"),
                    interest_rate=data.get("interestRate"),
                    maturity_date=data.get("maturity"),
                    index=data.get("index"),
                    fixed_income_type=data.get("fixedIncomeType"),
                    user=user,
                )
            else:
                order = Order(
                    name=data.get("name"),
                    broker=data.get("broker"),
                    asset_type=data.get("assetType"),
                    order_type=data.get("orderType"),
                    date=data.get("date"),
                    price=data.get("price"),
                    volume=data.get("volume"),
                    description=data.get("description"),
                    user=user,
                )

            order.save()
            return JsonResponse({"message": "Boleta criada"}, status=201)

        except Exception as e:
            print("Erro ao criar boleta")
            print(e)
            return JsonResponse({"message": str(e)}, status=500)

    elif request.method == "DELETE":
        try:
            order = Order.objects.get(user=user, id=id)

            order.delete()
            return JsonResponse({"message": "Boleta deletada"}, status=204)

        except Exception as e:
            print("Erro ao deletar boleta")
            print(e)
            return JsonResponse({"message": str(e)}, status=500)

    elif request.method == "GET":
        try:
            print("aaaaaa")
            order = Order.objects.get(id=id)
            print(order.user)
            # data = json.loads(response.text)
            # df = pd.DataFrame(order.values())
            return JsonResponse({"order": order}, status=200)

        except Exception as e:
            print("Erro ao buscar boleta")
            print(e)
            return JsonResponse({"message": str(e)}, status=500)

    elif request.method == "PATCH" and id:
        try:
            data = json.loads(request.body.decode("utf-8"))
            order = Order.objects.get(user=user, id=id)

            if "name" in data:
                order.name = data["name"]
            if "broker" in data:
                order.broker = data["broker"]
            if "assetType" in data:
                order.asset_type = data["assetType"]
            if "orderType" in data:
                order.order_type = data["orderType"]
            if "date" in data:
                order.date = data["date"]
            if "price" in data:
                order.price = data["price"]
            if "volume" in data:
                order.volume = data["volume"]
            if "description" in data:
                order.description = data["description"]
            if "interestRate" in data:
                order.interest_rate = data["interestRate"]
            if "maturity" in data:
                order.maturity_date = data["maturity"]
            if "index" in data:
                order.index = data["index"]
            if "fixedIncomeType" in data:
                order.fixed_income_type = data["fixedIncomeType"]

            order.save()

            return JsonResponse({"message": "Boleta atualizada com sucesso"})
        except Order.DoesNotExist:
            return JsonResponse({"message": "Boleta não encontrada"}, status=404)
        except Exception as e:
            return JsonResponse({"message": str(e)}, status=500)

    else:
        return JsonResponse(
            {"message": "Esta rota não suporta este tipo de solicitação"}, status=400
        )
