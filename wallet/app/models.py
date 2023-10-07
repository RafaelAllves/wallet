from django.db import models

class Asset(models.Model):
  ticker = models.CharField(max_length=8, primary_key=True)
  company_name = models.CharField(max_length=64, null=True)
  trading_name = models.CharField(max_length=32, null=True)
  cvm_code = models.CharField(max_length=8, null=True)
  cnpj = models.CharField(max_length=18, null=True)
  assert_class = models.CharField(max_length=32, null=True)
  category = models.CharField(max_length=32, null=True)
  sub_category = models.CharField(max_length=32, null=True)
  ipo_date = models.DateField(null=True)

class AssetPrice(models.Model):
  ticker = models.CharField(max_length=6)
  date = models.DateField()
  open = models.FloatField(null=True)
  low = models.FloatField(null=True)
  high = models.FloatField(null=True)
  mid = models.FloatField(null=True)
  close = models.FloatField()
  oscillation = models.FloatField(null=True)
  class Meta:
    constraints = [
        models.UniqueConstraint(fields=['ticker', 'date'], name='unique_ticker_date')
    ]
