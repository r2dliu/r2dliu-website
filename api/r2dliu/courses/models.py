# Create your models here.
from django.db import models

from r2dliu.utils.models import AbstractBaseModel


class Course(AbstractBaseModel):
    name = models.CharField(max_length=200)
    description = models.TextField()


class Class(AbstractBaseModel):
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    description = models.TextField()


class Subscriber(AbstractBaseModel):
    name = models.CharField(max_length=200)
    email = models.CharField(
        unique=True,
        max_length=200,
    )
