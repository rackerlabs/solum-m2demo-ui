from django.shortcuts import render

import models as solum_models
import json
import subprocess
import tempfile

def assemblies(req):
    assemblies = solum_models.Assembly.objects.all()
    context = {'assemblies': assemblies}
    response = render(req, 'assemblies.html.template', context)
    response["Access-Control-Allow-Origin"] = "*"
    return response

def newapp(req):
    # Display App Definition page.
    git_url = ''
    if req.method == 'GET':
        git_url = req.GET.get('githuburl', '')
    context = {'git_url': git_url}
    response = render(req, 'appdefine.html.template', context)
    response["Access-Control-Allow-Origin"] = "*"
    return response

def app(req, app_id):
    # Display App Deployment page.
    app_ = solum_models.Assembly.objects.get(uuid=app_id)
    context = {'assembly': app_}
    context['status'] = 'build'
    response = render(req, 'appdeploy.html.template', context)
    response["Access-Control-Allow-Origin"] = "*"
    return response

def appmanage(req):
    # Display App Definition page.
    git_url = ''
    if req.method == 'GET':
        git_url = req.GET.get('git', '')
    context = {'git_url': git_url}
    response = render(req, 'appmanage.html.template', context)
    response["Access-Control-Allow-Origin"] = "*"
    return response

###

def apps_json(req):
    apps_ = solum_models.Plan.objects.all()
    context = {'apps': apps_}
    response = render(req, 'apps.json.template', context)
    response["Access-Control-Allow-Origin"] = "*"
    return response

def app_json(req, app_id):
    app_ = solum_models.Plan.objects.get(uuid=app_id)
    get_app_uri = '~/get-app-uri.sh %s' % app_.uuid
    out, err = subprocess.Popen(['bash', '-c', get_app_uri],
                                stdout=subprocess.PIPE).communicate()
    app_.uri = out.strip()
    context = {
        'app': app_,
    }
    response = render(req, 'app.json.template', context)
    response["Access-Control-Allow-Origin"] = "*"
    return response

def new_app_json(req):
    plantext = ''
    planfile = req.FILES.get('planfile')
    if planfile is not None:
        print "Planfile from file upload."
        plantext = planfile.read()
    elif req.method == 'POST':
        planfile = req.POST.get('planfile')
        print "Planfile from form data."
        plantext = planfile
    if plantext:
        print "Plantext:"
        print plantext
        tmp = tempfile.NamedTemporaryFile(delete=False)
        tmp.write(plantext)
        tmp.close()
        new_app = '~/new-app.sh %s' % tmp.name
        print "Attempting bash -c %s" % new_app
        out, err = subprocess.Popen(['bash', '-c', new_app],
                                    stdout=subprocess.PIPE).communicate()
        uuid = out.strip()
        return app_json(req, uuid)

def assemblies_json(req):
    assemblies = solum_models.Assembly.objects.all()
    context = {'assemblies': assemblies}
    response = render(req, 'assemblies.json.template', context)
    response["Access-Control-Allow-Origin"] = "*"
    return response

def assembly_json(req, assembly_id):
    context = {
        'assembly': solum_models.Assembly.objects.get(uuid=assembly_id),
    }
    response = render(req, 'assembly.json.template', context)
    response["Access-Control-Allow-Origin"] = "*"
    return response

def new_assembly_json(req):
    plan_uri = req.POST.get('plan_uri')
    assembly_name = req.POST.get('assembly')
    new_assembly = '~/new-assembly.sh %s %s' % (plan_uri, assembly_name)
    out, err = subprocess.Popen(['bash', '-c', new_assembly],
                                stdout=subprocess.PIPE).communicate()
    uuid = out.strip()
    return assembly_json(req, uuid)
