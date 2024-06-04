from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from wallet.models import Order
from wallet.models import AssetConsolidatedValue
from app.models import AssetPrice
from datetime import timedelta, datetime
from decimal import Decimal


class Command(BaseCommand):

    help = "Consolida a carteira"

    def add_arguments(self, parser):
        parser.add_argument(
            "--tickers", nargs="*", default=None, help="Tickers to consolidate"
        )

    def handle(self, *args, **options):

        tickers = options["tickers"]
        user = User.objects.get()

        assets = Order.objects.filter(user=user, asset_type="RF")

        if tickers:
            assets = Order.objects.filter(name__in=tickers)

        for asset in assets:
            asset_name = asset.name

            first_purchase_date = (
                Order.objects.filter(name=asset_name, user=user, order_type=1)
                .earliest("date")
                .date
            )

            current_date = datetime.today().date()
            consolidated_value = 0
            daily_variation = asset.interest_rate / 36500
            current_price = asset.price

            current = first_purchase_date
            while current < current_date:
                current_price += current_price * daily_variation

                consolidated_value = current_price

                asset_consolidated_value, created = (
                    AssetConsolidatedValue.objects.get_or_create(
                        user=user,
                        name=asset_name,
                        date=current,
                        defaults={
                            "value": consolidated_value,
                            "volume": asset.volume,
                            "invested": asset.price,
                            "asset_type": "RF",
                        },
                    )
                )

                if not created:
                    asset_consolidated_value.value = consolidated_value
                    asset_consolidated_value.volume = asset.volume
                    asset_consolidated_value.invested = asset.price
                    asset_consolidated_value.asset_type = "RF"
                    asset_consolidated_value.save()

                print(asset_name, current, consolidated_value)

                current += timedelta(days=1)
