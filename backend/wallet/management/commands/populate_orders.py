import csv
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from wallet.models import Order
from app.models import Asset

class Command(BaseCommand):
  def handle(self, *args, **options):
    def import_csv(file_path):
      user = User.objects.get()
      orders_to_create = []
      assets_updated = []

      with open(file_path, 'r') as csv_file:
        csv_reader = csv.DictReader(csv_file)

        for row in csv_reader:
          print(f"Buy {row['volume']} {row['ticker']} in {row['date']}")

          if row['ticker'] not in assets_updated:
            try:
              asset = Asset.objects.get(ticker=row['ticker'])

              asset.asset_class=row['type']
              asset.category=row['category']
              asset.sub_category=row['sub_category']
              asset.save()
              assets_updated.append(row['ticker'])
            except Exception as e:
              print(f"erro ao atualizar {row['ticker']}")
              print(e)

          try:
            order = Order(
              name=row['ticker'],
              broker='Nu Invest',
              asset_type=row['type'],
              order_type=1,
              date=row['date'],
              price=float(row['price']),
              volume=int(row['volume']),
              user=user,
            )
            orders_to_create.append(order)
          except Exception as e:
            print(f"erro ao instanciar {row['ticker']} {row['date']}")
            print(e)

      try:
        Order.objects.bulk_create(orders_to_create)
        print(f"Add {len(orders_to_create)} orders")
      except Exception as e:
        print(f"erro ao boletar")
        print(e)

    import_csv('investimentos.csv')
