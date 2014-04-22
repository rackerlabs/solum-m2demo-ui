#!/bin/bash
PLAN_URI=$1
shift
ASSEMBLY_NAME=$1
shift
source ~/devstack/openrc
solum assembly create $PLAN_URI --assembly=$ASSEMBLY_NAME | awk '/uuid/ {print $4;}'
