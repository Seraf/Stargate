from tastypie.authorization import DjangoAuthorization
from django.contrib.auth.models import User, Group
from tastypie import fields
from tastypie.resources import ModelResource
from tastypie.authentication import ApiKeyAuthentication
from tastypie.models import ApiKey, create_api_key
from tastypie.utils import trailing_slash
from tastypie.http import HttpUnauthorized, HttpForbidden
from django.conf.urls import url
from django.contrib.auth import authenticate, login, logout
from django.db import models


class GroupResource(ModelResource):
    class Meta:
        queryset = Group.objects.all()
        resource_name = 'group'
        #allowed_methods = ('get','post')
        authorization = DjangoAuthorization()
        authentication = ApiKeyAuthentication()

class UserResource(ModelResource):
    groups = fields.ManyToManyField(GroupResource, 'groups', null=True, full=True)

    class Meta:
        queryset = User.objects.all()
        resource_name = 'user'
        authorization = DjangoAuthorization()
        authentication = ApiKeyAuthentication()
        excludes = ['username', 'password']


    def dehydrate(self, bundle):
        bundle.data['username'] = bundle.obj.username
        return bundle

    def prepend_urls(self):
        return [
            url(r"^(?P<resource_name>%s)/login%s$" %
                (self._meta.resource_name, trailing_slash()),
                self.wrap_view('login'), name="api_login"),
            url(r'^(?P<resource_name>%s)/logout%s$' %
                (self._meta.resource_name, trailing_slash()),
                self.wrap_view('logout'), name='api_logout'),
        ]

    def login(self, request, **kwargs):
        self.method_check(request, allowed=['post'])

        data = self.deserialize(request, request.body, format=request.META.get('CONTENT_TYPE', 'application/json'))

        username = data.get('username', '')
        password = data.get('password', '')

        user = authenticate(username=username, password=password)
        if user:
            if user.is_active:
                login(request, user)

                try:
                    key = ApiKey.objects.get(user=user)
                except ApiKey.DoesNotExist:
                    return self.create_response(
                        request, {
                            'success': False,
                            'reason': 'missing key',
                        },
                        HttpForbidden,
                    )

                ret = self.create_response(request, {
                    'success': True,
                    'username': user.username,
                    'key': key.key
                })
                #print 5656; import pdb;pdb.set_trace()
                return ret
            else:
                return self.create_response(
                    request, {
                        'success': False,
                        'reason': 'disabled',
                    },
                    HttpForbidden,
                )
        else:
            return self.create_response(
                request, {
                    'success': False,
                    'reason': 'invalid login',
                    'skip_login_redir': True,
                },
                HttpUnauthorized,
            )

    def logout(self, request, **kwargs):
        self.method_check(request, allowed=['get'])
        if request.user and request.user.is_authenticated():
            logout(request)
            return self.create_response(request, {'success': True})
        else:
            return self.create_response(request, {'success': False}, HttpUnauthorized)

models.signals.post_save.connect(create_api_key, sender=User)