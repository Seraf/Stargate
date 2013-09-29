from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

from api import UserResource, GroupResource
from tastypie.api import Api
import tastypie_swagger

v1_api = Api(api_name='v1')
v1_api.register(UserResource())
v1_api.register(GroupResource())

urlpatterns = patterns('',
    # Examples:
    #url(r'^$', 'Xtranet.views.home', name='home'),
    #url(r'^Xtranet/', include('Xtranet.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),

    #API
    url(r'^api/', include(v1_api.urls)),
    url(r'^api/docs/', include('tastypie_swagger.urls', namespace='tastypie_swagger')),

)
