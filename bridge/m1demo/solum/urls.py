from django.conf.urls import patterns, include, url

import views

uuid_regex = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'
app_regex = '^apps/(?P<app_id>%s)$' % uuid_regex
assembly_regex = '^assemblies/(?P<assembly_id>%s)$' % uuid_regex

urlpatterns = patterns('',
    url('^apps$', views.apps_json, name='apps_json'),
    url('^apps/new$', views.new_app_json, name='new_app_json'),
    url(app_regex, views.app_json, name='app_json'),
    url('^assemblies$', views.assemblies_json, name='assemblies_json'),
    url('^assemblies/new$', views.new_assembly_json, name='new_assemblies_json'),
    url(assembly_regex, views.assembly_json, name='assembly_json'),

    url('^$', views.assemblies, name='assemblies'),
    url('^newapp$', views.newapp, name='newapp'),
    url('^app/(?P<app_id>%s)$' % uuid_regex, views.app, name='viewapp'),
)
