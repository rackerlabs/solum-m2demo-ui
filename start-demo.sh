#!/bin/bash
cd /opt/stack/solum-gui/bridge/m1demo
screen -dmS bridge
screen -S bridge -p 0 -X stuff 'python ./manage.py runserver 0.0.0.0:9001
'

#cd /opt/stack/solum-gui/ui/
#screen -dmS ui
#screen -S ui -p 0 -X stuff 'python -mSimpleHTTPServer 8001
#'
