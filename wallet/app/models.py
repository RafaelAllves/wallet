from django.db import models

class Asset(models.Model):
  ticker = models.CharField(max_length=6, primary_key=True)
  assert_class = models.CharField(max_length=32)
  category = models.CharField(max_length=32, null=True)
  sub_category = models.CharField(max_length=32, null=True)
  ipo_date = models.DateField(null=True)
