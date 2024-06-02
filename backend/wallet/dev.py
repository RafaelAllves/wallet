from decimal import Decimal
from django.db.models import F
from app.models import AssetPrice
from wallet.models import Order

AssetPrice.objects.filter(ticker="BCFF11", date__lte="2023-11-28").update(
  open=F('open') / 8,
  low=F('low') / 8,
  high=F('high') / 8,
  mid=F('mid') / 8,
  close=F('close') / 8,
)

Order.objects.filter(name="BCFF11", date__lte="2023-11-28").update(
  price=F('price') / 8,
  volume=F('volume') * 8,
)