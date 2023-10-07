import requests
import json
from django.core.management.base import BaseCommand
from app.models import Asset

class Command(BaseCommand):
  help = 'Este é um comando personalizado do Django.'



  def handle(self, *args, **options):
    def formatar_cnpj(cnpj):
      cnpj = cnpj.zfill(14)
      cnpj_formatado = "{}.{}.{}/{}-{}".format(cnpj[:2], cnpj[2:5], cnpj[5:8], cnpj[8:12], cnpj[12:])
      return cnpj_formatado

    def get_standard_lot():
      response = requests.request("GET", "https://arquivos.b3.com.br/bdi/table/StandardLot/2023-10-05/2023-10-05/1/2000")
      data = json.loads(response.text)

      print('get standard lot')

      if data["table"] and data["table"]['values']:
        for asset_data in data["table"]['values']:
          # ticker, trading_name, cod, open, low, high, mid, close, oscillation, pch_pric, sl_pric, num, trad_qty, offers, trades, aux = asset_data

          ticker = asset_data[0]
          if not Asset.objects.filter(ticker=ticker).exists():
            new_asset = Asset(ticker=ticker)
            new_asset.save()
            print(f'{ticker} added')
    
    def get_real_estate_funds():
      response = requests.request("GET", "https://arquivos.b3.com.br/bdi/table/RealEstateFunds/2023-10-05/2023-10-05/1/2000")
      data = json.loads(response.text)

      print('get real estate funds')

      if data["table"] and data["table"]['values']:
        for asset_data in data["table"]['values']:
          # ticker, trading_name, cod, open, low, high, mid, close, oscillation, pch_pric, sl_pric, num, trad_qty, offers, trades, aux = asset_data

          ticker = asset_data[0]
          name = asset_data[1]
          assets = Asset.objects.filter(ticker=ticker)
          if not assets.exists():
            new_asset = Asset(ticker=ticker, assert_class='FII', trading_name=name)
            new_asset.save()
            print(f'{ticker} added')
          else:
            for asset in assets:
              asset.assert_class = 'FII'
              asset.trading_name = name
              asset.save()
              print(f'{ticker} update')

    def get_initial_companies():
      response = requests.request("GET", "https://sistemaswebb3-listados.b3.com.br/listedCompaniesProxy/CompanyCall/GetInitialCompanies/eyJsYW5ndWFnZSI6InB0LWJyIiwicGFnZU51bWJlciI6MSwicGFnZVNpemUiOjEwMDAwLCJnb3Zlcm5hbmNlIjoiMCJ9")
      data = json.loads(response.text)

      print('get initial companies')

      if data['results']:
        for company in data['results']:
          assets = Asset.objects.filter(ticker__startswith=company['issuingCompany'])

          if assets:
            for asset in assets:
              asset.company_name = company['companyName']
              asset.trading_name = company['tradingName']
              asset.cvm_code = company['codeCVM']
              asset.cnpj = formatar_cnpj(company['cnpj'])
              asset.category = company['segment'][:32]

              asset.save()
            
              print(f'ticker {asset.ticker} populated')

    def get_listed_funds_sig():
      response = requests.request("GET", "https://sistemaswebb3-listados.b3.com.br/fundsProxy/fundsCall/GetListedFundsSIG/eyJ0eXBlRnVuZCI6NywicGFnZU51bWJlciI6MSwicGFnZVNpemUiOjEwMDB9")
      data = json.loads(response.text)

      print('get listed funds sig')

      if data['results']:
        for fund in data['results']:
          assets = Asset.objects.filter(ticker__startswith=fund['acronym'])

          if assets:
            for asset in assets:
              asset.company_name = fund['companyName']
              asset.trading_name = fund['fundName']

              asset.save()
            
              print(f'ticker {asset.ticker} populated')

    get_standard_lot()
    get_real_estate_funds()
    get_initial_companies()
    get_listed_funds_sig()
