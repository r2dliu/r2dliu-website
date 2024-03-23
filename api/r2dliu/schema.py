import graphene
from graphene import relay
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField

from r2dliu.courses.models import Class


class ClassType(DjangoObjectType):
    class Meta:
        model = Class
        fields = ("id", "start_time", "end_time", "description")
        interfaces = (relay.Node,)
        filter_fields = {"start_time": ["gte"], "end_time": ["lte"]}


class ClassConnection(relay.Connection):
    class Meta:
        node = ClassType


class Query(graphene.ObjectType):
    classes = DjangoFilterConnectionField(ClassType)
    # classes = relay.ConnectionField(ClassConnection)
    hello = graphene.String(default_value="Hi!")

    def resolve_classes(root, info, **kwargs):
        # Querying a list
        return Class.objects.all()


schema = graphene.Schema(query=Query)
