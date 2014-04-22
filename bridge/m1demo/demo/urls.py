from django.conf.urls import patterns, include, url

import views

uuid_regex = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'
app_regex = '^apps/(?P<app_id>%s)$' % uuid_regex
assembly_regex = '^assemblies/(?P<assembly_id>%s)$' % uuid_regex

urlpatterns = patterns('',
    url('^apps$', views.apps, name='apps'),
    url('^apps/new$', views.new_app, name='new_app'),
    url(app_regex, views.app, name='app'),
    url('^assemblies$', views.assemblies, name='assemblies'),
    url('^assemblies/new$', views.new_assembly, name='new_assemblies'),
    url(assembly_regex, views.assembly, name='assembly'),
)
