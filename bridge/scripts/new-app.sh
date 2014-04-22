#!/bin/bash
FILENAME=$1
shift
source ~/devstack/openrc
solum app create $FILENAME | awk '/uuid/ {print $4;}'
