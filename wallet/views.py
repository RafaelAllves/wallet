from django.shortcuts import render
from django.http import JsonResponse
from app.models import AssetPrice, Asset
from wallet.models import AssetConsolidatedValue
from dateutil.relativedelta import relativedelta
from django.utils import timezone
from .models import Order
import pandas as pd


def position(request, user):
  orders = Order.objects.filter(user=user)
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
      latest_price = AssetPrice.objects.filter(ticker = asset_name).last()
      asset = Asset.objects.get(ticker = asset_name)
      assets[asset_name] = {
        "name": asset_name,
        "asset_class": asset.asset_class,
        "category": asset.category,
        "sub_category": asset.sub_category,
        "volume": int(volume),
        "cost": cost * int(volume),
        "price": latest_price.close if latest_price else None
      }

    if assets[asset_name]["asset_class"] in asset_classes:
      asset_classes[assets[asset_name]["asset_class"]]["value"] += int(volume) * assets[asset_name]["price"]
    else:
      asset_classes[assets[asset_name]["asset_class"]] = {
        "value": (assets[asset_name]["price"] * int(volume))
      }

  df = pd.DataFrame(assets.values())

  return JsonResponse({"assets": df.values.tolist(), "asset_classes": asset_classes}, safe=False)


def position_history(request, user):

  ticker = request.GET.get('ticker')
  asset_consolidated_values = AssetConsolidatedValue.objects.filter(user=user)

  if ticker:
    asset_consolidated_values = asset_consolidated_values.filter(name=ticker.upper())


  df = pd.DataFrame(asset_consolidated_values.values())
  df = df[['date', 'value', 'invested']]
  df['date'] = pd.to_datetime(df['date'])

  grouped = df.groupby('date').agg({'value': 'sum', 'invested': 'sum'}).reset_index()
  grouped['date'] = grouped['date'].dt.strftime('%d/%m/%Y')
  grouped['value'] = grouped['value'].astype(float)
  grouped['invested'] = grouped['invested'].astype(float)

  return JsonResponse({"labels": grouped['date'].values.tolist(), "values": grouped['value'].values.tolist(), "invested": grouped['invested'].values.tolist()}, safe=False)
