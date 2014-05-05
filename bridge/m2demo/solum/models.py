# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Remove `managed = False` lines for those models you wish to give write DB access
# Feel free to rename the models, but don't rename db_table values or field names.
#
# Also note: You'll have to insert the output of 'django-admin.py sqlcustom [appname]'
# into your database.
from __future__ import unicode_literals

import json
from django.db import models

class AlembicVersion(models.Model):
    version_num = models.CharField(max_length=32)
    class Meta:
        managed = False
        db_table = 'alembic_version'

class Assembly(models.Model):
    id = models.IntegerField(primary_key=True)
    uuid = models.CharField(max_length=36)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    name = models.CharField(max_length=100, blank=True)
    description = models.CharField(max_length=255, blank=True)
    project_id = models.CharField(max_length=36, blank=True)
    user_id = models.CharField(max_length=36, blank=True)
    tags = models.TextField(blank=True)
    plan = models.ForeignKey('Plan')
    trigger_id = models.CharField(max_length=36, blank=True)
    status = models.CharField(max_length=36, blank=True)
    application_uri = models.CharField(max_length=1024, blank=True)
    class Meta:
        managed = False
        db_table = 'assembly'

    @property
    def git_url(self):
        return self.plan.git_url

class CompilerVersions(models.Model):
    id = models.IntegerField(primary_key=True)
    uuid = models.CharField(max_length=36)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    version = models.CharField(max_length=36)
    language_pack = models.ForeignKey('LanguagePack')
    class Meta:
        managed = False
        db_table = 'compiler_versions'

class Component(models.Model):
    id = models.IntegerField(primary_key=True)
    uuid = models.CharField(max_length=36)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    name = models.CharField(max_length=100, blank=True)
    description = models.CharField(max_length=255, blank=True)
    project_id = models.CharField(max_length=36, blank=True)
    user_id = models.CharField(max_length=36, blank=True)
    tags = models.TextField(blank=True)
    assembly = models.ForeignKey(Assembly, blank=True, null=True)
    parent_component = models.ForeignKey('self', blank=True, null=True)
    resource_uri = models.CharField(max_length=1024, blank=True)
    class Meta:
        managed = False
        db_table = 'component'

class Extension(models.Model):
    id = models.IntegerField(primary_key=True)
    uuid = models.CharField(max_length=36)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    project_id = models.CharField(max_length=36, blank=True)
    user_id = models.CharField(max_length=36, blank=True)
    description = models.CharField(max_length=255, blank=True)
    name = models.CharField(max_length=100, blank=True)
    version = models.CharField(max_length=16, blank=True)
    documentation = models.CharField(max_length=255, blank=True)
    class Meta:
        managed = False
        db_table = 'extension'

class Image(models.Model):
    id = models.IntegerField(primary_key=True)
    uuid = models.CharField(max_length=36)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    name = models.CharField(max_length=100, blank=True)
    description = models.CharField(max_length=255, blank=True)
    source_uri = models.CharField(max_length=255, blank=True)
    project_id = models.CharField(max_length=36, blank=True)
    user_id = models.CharField(max_length=36, blank=True)
    tags = models.TextField(blank=True)
    state = models.CharField(max_length=12, blank=True)
    base_image_id = models.CharField(max_length=36, blank=True)
    created_image_id = models.CharField(max_length=36, blank=True)
    image_format = models.CharField(max_length=12, blank=True)
    source_format = models.CharField(max_length=12, blank=True)
    class Meta:
        managed = False
        db_table = 'image'

class LanguagePack(models.Model):
    id = models.IntegerField(primary_key=True)
    uuid = models.CharField(max_length=36)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    name = models.CharField(max_length=100, blank=True)
    description = models.CharField(max_length=255, blank=True)
    project_id = models.CharField(max_length=36, blank=True)
    user_id = models.CharField(max_length=36, blank=True)
    tags = models.TextField(blank=True)
    attr_blob = models.CharField(max_length=255, blank=True)
    language_implementation = models.CharField(max_length=100, blank=True)
    language_pack_type = models.CharField(max_length=100, blank=True)
    class Meta:
        managed = False
        db_table = 'language_pack'

class Operation(models.Model):
    id = models.IntegerField(primary_key=True)
    uuid = models.CharField(max_length=36)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    name = models.CharField(max_length=100, blank=True)
    description = models.CharField(max_length=255, blank=True)
    project_id = models.CharField(max_length=36, blank=True)
    user_id = models.CharField(max_length=36, blank=True)
    tags = models.TextField(blank=True)
    documentation = models.TextField(blank=True)
    target_resource = models.TextField(blank=True)
    class Meta:
        managed = False
        db_table = 'operation'

class OsPlatform(models.Model):
    id = models.IntegerField(primary_key=True)
    uuid = models.CharField(max_length=36)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    os = models.CharField(db_column='OS', max_length=36) # Field name made lowercase.
    version = models.CharField(max_length=36)
    language_pack = models.ForeignKey(LanguagePack)
    class Meta:
        managed = False
        db_table = 'os_platform'

class Plan(models.Model):
    id = models.IntegerField(primary_key=True)
    uuid = models.CharField(max_length=36)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    project_id = models.CharField(max_length=36, blank=True)
    user_id = models.CharField(max_length=36, blank=True)
    raw_content = models.CharField(max_length=2048, blank=True)
    name = models.CharField(max_length=255, blank=True)
    description = models.CharField(max_length=255, blank=True)
    class Meta:
        managed = False
        db_table = 'plan'

    @property
    def git_url(self):
        rawc = json.loads(self.raw_content)
        for artifact in rawc.get('artifacts', []):
            url = artifact.get('content', {}).get('href')
            if url is not None:
                return url

class Sensor(models.Model):
    id = models.IntegerField(primary_key=True)
    uuid = models.CharField(max_length=36)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    project_id = models.CharField(max_length=36, blank=True)
    user_id = models.CharField(max_length=36, blank=True)
    name = models.CharField(max_length=255, blank=True)
    sensor_type = models.CharField(max_length=255, blank=True)
    value = models.CharField(max_length=255, blank=True)
    timestamp = models.DateTimeField(blank=True, null=True)
    description = models.CharField(max_length=255, blank=True)
    documentation = models.CharField(max_length=255, blank=True)
    target_resource = models.CharField(max_length=255, blank=True)
    class Meta:
        managed = False
        db_table = 'sensor'

class Service(models.Model):
    id = models.IntegerField(primary_key=True)
    uuid = models.CharField(max_length=36)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    name = models.CharField(max_length=100, blank=True)
    description = models.CharField(max_length=255, blank=True)
    project_id = models.CharField(max_length=36, blank=True)
    user_id = models.CharField(max_length=36, blank=True)
    service_type = models.CharField(max_length=100, blank=True)
    read_only = models.IntegerField(blank=True, null=True)
    tags = models.TextField(blank=True)
    class Meta:
        managed = False
        db_table = 'service'

