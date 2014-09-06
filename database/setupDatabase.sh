#!/bin/bash

mysqlArgs=''

if [ "$#" -gt 0 ]; then
    mysqlArgs='--user='$1' -p'
fi

mysql $mysqlArgs --batch --verbose < schema.sql

read -r -p 'Press [Enter] to continue...'
