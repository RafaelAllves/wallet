from django.shortcuts import render
from django.http import JsonResponse
from app.models import AssetPrice
from app.models import Asset
from .models import Order
import pandas as pd


def position(request, user):
  orders = Order.objects.filter(user=user)
  assets = {}
  for order in orders:
    asset_name = order.name
    volume = order.volume
    cost = order.price

    if asset_name in assets:
        assets[asset_name]["volume"] += int(volume)
        assets[asset_name]["cost"] += cost
    else:
        latest_price = AssetPrice.objects.filter(ticker = asset_name).last()
        asset = Asset.objects.get(ticker = asset_name)
        assets[asset_name] = {
            "name": asset_name,
            "asset_class": asset.asset_class,
            "category": asset.category,
            "sub_category": asset.sub_category,
            "volume": int(volume),
            "cost": cost,
            "price": latest_price.close if latest_price else None
        }

  df = pd.DataFrame(assets.values())
  print(df.values.tolist())

  return JsonResponse(df.values.tolist(), safe=False)

