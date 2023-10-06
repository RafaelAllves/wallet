from django.db import models

class Asset(models.Model):
  ticker = models.CharField(max_length=6, primary_key=True)
  cnpj = models.CharField(max_length=18, unique=True)
  assert_class = models.CharField(max_length=32)
  category = models.CharField(max_length=32, null=True)
  sub_category = models.CharField(max_length=32, null=True)
  ipo_date = models.DateField(null=True)

class AssetPrice(models.Model):
  ticker = models.CharField(max_length=6)
  date = models.DateField()
  open = models.FloatField(null=True)
  high = models.FloatField(null=True)
  low = models.FloatField(null=True)
  close = models.FloatField()
  class Meta:
    constraints = [
        models.UniqueConstraint(fields=['ticker', 'date'], name='unique_ticker_date')
    ]
