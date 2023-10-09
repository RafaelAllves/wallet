import requests
import json
from django.core.management.base import BaseCommand
from app.models import AssetPrice
import time
from datetime import datetime, timedelta

class Command(BaseCommand):
  help = 'Este é um comando personalizado do Django.'



  def handle(self, *args, **options):

    def get_standard_lot(start, end):
      response = requests.request("GET", f"https://arquivos.b3.com.br/bdi/table/StandardLot/{start}/{end}/1/2000")
      data = json.loads(response.text)

      print('get standard lot')

      new_data = [] 

      if data["table"] and data["table"]['values']:
        for asset_data in data["table"]['values']:
          ticker, trading_name, cod, open, low, high, mid, close, oscillation, pch_pric, sl_pric, num, trad_qty, offers, trades, aux = asset_data

          if isinstance(close, float) and not AssetPrice.objects.filter(ticker=ticker, date=end).exists():
            new_asset_price = AssetPrice(ticker=ticker, date=end, open=open, low=low, high=high, mid=mid, close=close)
            new_data.append(new_asset_price)
      
        print('standard lot:   ', len(new_data))
        AssetPrice.objects.bulk_create(new_data)





    
    def get_real_estate_funds(start, end):
      response = requests.request("GET", f"https://arquivos.b3.com.br/bdi/table/RealEstateFunds/{start}/{end}/1/2000")
      data = json.loads(response.text)

      print('get real estate funds')

      new_data = [] 

      if data["table"] and data["table"]['values']:
        for asset_data in data["table"]['values']:
          ticker, trading_name, cod, open, low, high, mid, close, oscillation, pch_pric, sl_pric, num, trad_qty, offers, trades, aux = asset_data

          if isinstance(close, float) and not AssetPrice.objects.filter(ticker=ticker, date=end).exists():
            new_asset_price = AssetPrice(ticker=ticker, date=end, open=open, low=low, high=high, mid=mid, close=close)
            new_data.append(new_asset_price)
      
        print('real estate:   ', len(new_data))
        AssetPrice.objects.bulk_create(new_data)

    data_inicio = datetime(2023, 10, 1)
    data_fim = datetime(2023, 10, 30)

    while data_inicio <= data_fim:

      date = data_inicio.strftime("%Y-%m-%d")
      print(date)
      get_standard_lot(date, date)
      get_real_estate_funds(date, date)
      
      time.sleep(3)

      data_inicio += timedelta(days=1)
