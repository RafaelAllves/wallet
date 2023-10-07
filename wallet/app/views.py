from django.shortcuts import render
from django.core import serializers
from django.http import JsonResponse
from django.http import HttpResponse
from .models import Asset
import json
import pandas as pd

def asset(request):
  assets = Asset.objects.all()

  return HttpResponse(json.dumps(list(assets.values())), content_type='application/json')
