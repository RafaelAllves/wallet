# Generated by Django 4.2.5 on 2023-10-14 18:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('wallet', '0002_alter_order_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='order_type',
            field=models.IntegerField(choices=[(1, 'buy'), (-1, 'sell')]),
        ),
    ]