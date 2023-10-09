from django.shortcuts import render
from django.core import serializers
from django.http import JsonResponse
from django.http import HttpResponse
from .models import Asset
from .models import AssetPrice
import json
import pandas as pd
import datetime

def asset(request):
  assets = Asset.objects.all()

  return HttpResponse(json.dumps(list(assets.values())), content_type='application/json')


def asset_prices(request, ticker):
  ticker = ticker.upper()
  prices = AssetPrice.objects.filter(ticker = ticker).order_by('date')
  df = pd.DataFrame(prices.values())
  df['date'] = pd.to_datetime(df['date'])
  df['date'] = df['date'].apply(lambda x: int(x.timestamp()) * 1000)
  df = df[['date', 'close']]

  return JsonResponse(df.values.tolist(), safe=False)
