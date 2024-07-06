from decimal import Decimal
from django.db.models import F
from app.models import AssetPrice
from wallet.models import Order

AssetPrice.objects.filter(ticker="BCFF11", date__lte="2023-11-28").update(
    open=F("open") / 8,
    low=F("low") / 8,
    high=F("high") / 8,
    mid=F("mid") / 8,
    close=F("close") / 8,
)

Order.objects.filter(name="BCFF11", date__lte="2023-11-28").update(
    price=F("price") / 8,
    volume=F("volume") * 8,
)


from django.db.models import F
from wallet.models import AssetConsolidatedValue

asset_values = AssetConsolidatedValue.objects.filter(date="2024-06-04")
ordered_assets = asset_values.annotate(
    value_times_volume=F("value") * F("volume")
).order_by("-value_times_volume")
top_10_assets = ordered_assets[:10]
