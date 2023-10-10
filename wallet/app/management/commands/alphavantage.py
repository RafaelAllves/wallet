from django.core.management.base import BaseCommand
from app.models import AssetPrice
import pandas as pd
import requests
from decouple import config

class Command(BaseCommand):

		help = 'Scrapper to fix the high/low of futures reference, getting the data from barchart.'
		def add_arguments(self, parser):
			parser.add_argument('asset', nargs='*', type=str, default='')

		def handle(self, *args, **options):
			print("Starting process.")
			assets = options['asset']
			for i, asset in enumerate(assets):
				api_key = config('ALPHAVANTAGE_KEY')

				# Símbolo no Alpha Vantage
				symbol = asset+'.SAO'

				url = f'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&outputsize=full&apikey={api_key}'

				response = requests.get(url)
				data = response.json()
				time_series = data['Time Series (Daily)']

				df = pd.DataFrame.from_dict(time_series, orient='index')
				df.index = pd.to_datetime(df.index)
				df.sort_index(inplace=True)
				df.columns = ['Open', 'High', 'Low', 'Close', 'Volume']
				df = df.apply(pd.to_numeric)
				for date, row in df[::-1].iterrows():
					market_data = AssetPrice(
						ticker=asset,
						date=date,
						open = row['Open'],
						high = row['High'],
						low = row['Low'],
						close = row['Close']
					)
					try:
						market_data.save()
						print(asset, date, 'OK')
					except Exception as e:
						print(str(e))
