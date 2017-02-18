#!/usr/bin/env bash


$SCI_RESULT=$(ps aux | grep "/usr/bin/python SimpleCIServer/simple_ci_server.py" | wc -l)
if [ "$SCI_RESULT" == 1 ]; then
    echo "Simple CI server has died. RIP. Now restarting."
    CURRENT_DIR=$(pwd)
    cd /home/ubuntu/Hardon
    /usr/bin/python SimpleCIServer/simple_ci_server.py
    cd $CURRENT_DIR
fi


$BKD_RESULT=$(ps aux | grep "/home/ubuntu/Hadron/Backend/backend_env/bin/python Backend/backend/manage.py runserver 0.0.0.0:8000" | wc -l)
if [ "$BKD_RESULT" == 1 ]; then
    echo "Simple CI server has died. RIP. Now restarting."
    CURRENT_DIR=$(pwd)
    cd /home/ubuntu/Hardon
    Backend/backend_env/bin/python /home/ubuntu/Hadron/Backend/backend/manage.py runserver 0.0.0.0:8000
    cd $CURRENT_DIR
fi