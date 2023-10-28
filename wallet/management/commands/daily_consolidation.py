from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from wallet.models import Order
from wallet.models import AssetConsolidatedValue
from app.models import AssetPrice
from datetime import timedelta, datetime
from decimal import Decimal


class Command(BaseCommand):
  def handle(self, *args, **options):
    user = User.objects.get()
    assets = Order.objects.filter(user=user).values('name').distinct()

    for asset in assets:
      asset_name = asset['name']


      current_date = datetime.today().date()
      start_date = current_date - timedelta(days=10)
      invested = 0
      consolidated_value = 0
      volume = 0


      purchases = Order.objects.filter(name=asset_name, user=user, date__lt=start_date)

      if purchases:
        for purchase in purchases:
          volume += purchase.volume * purchase.order_type
          invested += purchase.price * purchase.volume * purchase.order_type

      current = start_date
      while current < current_date:
        assetPrice = AssetPrice.objects.filter(ticker=asset_name, date__lte=current).latest('date')
        daily_purchases = Order.objects.filter(name=asset_name, user=user, date=current)

        if daily_purchases:
          for purchase in daily_purchases:
            volume += purchase.volume * purchase.order_type
            invested += purchase.price * purchase.volume * purchase.order_type

        consolidated_value = volume * Decimal(str(assetPrice.close))

        asset_consolidated_value, created = AssetConsolidatedValue.objects.get_or_create(
          user=user,
          name=asset_name,
          date=current,
          defaults={'value': consolidated_value, 'volume': volume, 'invested': invested}
        )

        if not created:
          asset_consolidated_value.value = consolidated_value
          asset_consolidated_value.volume = volume
          asset_consolidated_value.invested = invested
          asset_consolidated_value.save()

        print(asset_name, current, volume, consolidated_value, invested)

        current += timedelta(days=1)
