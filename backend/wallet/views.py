from django.http import JsonResponse
from app.models import AssetPrice, Asset
from wallet.models import AssetConsolidatedValue, Order
import pandas as pd
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
import json
from django.db.models import Q
from django.utils import timezone


INDEX_CHOICES = [
    ("P", "Prefixed"),
    ("S", "Selic"),
    ("I", "IPCA"),
]

index_names = {code: name for code, name in INDEX_CHOICES}


def position(request):
    user = User.objects.get()
    asset_type = request.GET.get("class")

    orders = Order.objects.filter(
        Q(user=user)
        & (Q(asset_type="RF", maturity_date__gte=timezone.now()) | ~Q(asset_type="RF"))
    )

    if asset_type:
        orders = orders.filter(asset_type=asset_type.upper())

    assets = {}
    asset_classes = {}
    categories = {}

    # TODO: Refatorar para ser mais eficiente
    for order in orders:
        asset_name = order.name
        volume = order.volume
        cost = order.price

        if asset_name in assets:
            assets[asset_name]["volume"] += int(volume)
            assets[asset_name]["cost"] += cost * int(volume)
        elif order.asset_type == "RF":
            latest_price = AssetConsolidatedValue.objects.filter(name=asset_name).last()
            index_full_name = index_names.get(order.index, order.index)

            assets[asset_name] = {
                "name": asset_name,
                "asset_class": "RF",
                "category": index_full_name,
                "sub_category": order.fixed_income_type,
                "volume": int(volume),
                "cost": cost * int(volume),
                "price": latest_price.value / int(volume),
                "value": latest_price.value,
            }
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
                "value": (int(volume) * latest_price.close) if latest_price else None,
            }

        if assets[asset_name]["price"]:
            added_value = (
                assets[asset_name]["value"]
                if order.asset_type == "RF"
                else int(volume) * assets[asset_name]["price"]
            )

            if assets[asset_name]["category"] in categories:
                categories[assets[asset_name]["category"]]["value"] += added_value
            else:
                categories[assets[asset_name]["category"]] = {"value": added_value}

        if asset_type:
            continue

        #  TODO: Refatorar para não repetir código
        if (
            assets[asset_name]["asset_class"] in asset_classes
            and assets[asset_name]["price"]
        ):
            if order.asset_type == "RF":
                asset_classes[assets[asset_name]["asset_class"]]["value"] += assets[
                    asset_name
                ]["price"]
            else:
                asset_classes[assets[asset_name]["asset_class"]]["value"] += (
                    int(volume) * assets[asset_name]["price"]
                )
        elif assets[asset_name]["price"]:
            if order.asset_type == "RF":
                asset_classes[assets[asset_name]["asset_class"]] = {
                    "value": assets[asset_name]["price"]
                }
            else:
                asset_classes[assets[asset_name]["asset_class"]] = {
                    "value": (assets[asset_name]["price"] * int(volume))
                }
    if asset_type:
        asset_classes = assets

    df = pd.DataFrame(assets.values())

    return JsonResponse(
        {
            "assets": df.values.tolist(),
            "asset_classes": asset_classes,
            "categories": categories,
        },
        safe=False,
    )


def position_history(request):

    ticker = request.GET.get("ticker")
    asset_type = request.GET.get("class")
    user = User.objects.get()
    asset_consolidated_values = AssetConsolidatedValue.objects.filter(
        user=user
    ).exclude(name="profit")

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

    grouped = df.groupby("date").agg({"value": "sum", "invested": "sum"}).reset_index()

    grouped["date"] = grouped["date"].dt.strftime("%d/%m/%Y")
    grouped["value"] = grouped["value"].astype(float)
    grouped["invested"] = grouped["invested"].astype(float)

    return JsonResponse(
        {
            "labels": grouped["date"].values.tolist(),
            "values": grouped["value"].values.tolist(),
            "invested": grouped["invested"].values.tolist(),
        },
        safe=False,
    )


def orders(request):
    user = request.user
    ticker = request.GET.get("ticker")
    orders = Order.objects.filter(user=user)

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
                    name=data.get("name") + " " + str(data.get("maturity")),
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
