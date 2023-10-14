from django.db import models
from django.contrib.auth.models import User

class Order(models.Model):
  ASSET_TYPES = [
    ('AC', 'Ações'),
    ('RF', 'Renda Fixa'),
    ('FII', 'Fundos de Investimento Imobiliário'),
    ('TD', 'Tesouro Direto'),
  ]

  ORDER_TYPES = [
    (1, 'buy'),
    (-1, 'sell'),
  ]

  INDEX_CHOICES = [
    ('P', 'Prefixed'),
    ('S', 'Selic'),
    ('I', 'IPCA'),
  ]

  name = models.CharField(max_length=32)
  broker = models.CharField(max_length=32)
  asset_type = models.CharField(max_length=3, choices=ASSET_TYPES)
  order_type = models.CharField(max_length=4, choices=ORDER_TYPES)
  date = models.DateField()
  price = models.DecimalField(max_digits=8, decimal_places=2)
  volume = models.DecimalField(max_digits=8, decimal_places=4)
  description = models.TextField(null=True, blank=True)
  interest_rate = models.DecimalField(max_digits=8, decimal_places=5, null=True)
  maturity_date = models.DateField(null=True)
  index = models.CharField(max_length=1, choices=INDEX_CHOICES, null=True)

  user = models.OneToOneField(User)

  def __str__(self):
    return self.name