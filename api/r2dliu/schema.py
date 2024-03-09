import graphene
from graphene import relay
from graphene_django import DjangoObjectType
from r2dliu.courses.models import Class


class ClassType(DjangoObjectType):
    class Meta:
        model = Class
        fields = ("id", "start_time", "end_time", "description")
        interfaces = (relay.Node,)


class ClassConnection(relay.Connection):
    class Meta:
        node = ClassType


class Query(graphene.ObjectType):
    classes = relay.ConnectionField(ClassConnection)
    hello = graphene.String(default_value="Hi!")

    def resolve_classes(root, info, **kwargs):
        # Querying a list
        return Class.objects.all()


schema = graphene.Schema(query=Query)
