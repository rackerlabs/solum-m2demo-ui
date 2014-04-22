#!/bin/bash
UUID=$1
shift
source ~/devstack/openrc
solum app show $UUID | awk '/uri/ {print $4;}'
