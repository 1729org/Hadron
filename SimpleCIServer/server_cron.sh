#!/usr/bin/env bash


SCI_RESULT=$(ps aux | grep "/usr/bin/python SimpleCIServer/simple_ci_server.py" | wc -l)
echo "SCI_RESULT: $SCI_RESULT"

if [ "$SCI_RESULT" -eq "1" ]; then
    echo "Simple CI server has died. RIP. Now restarting."
    CURRENT_DIR=$(pwd)
    cd /home/ubuntu/Hardon
    /usr/bin/python SimpleCIServer/simple_ci_server.py
    cd $CURRENT_DIR
fi


BKD_RESULT=$(ps aux | grep "/home/ubuntu/Hadron/Backend/backend_env/bin/python Backend/backend/manage.py runserver 0.0.0.0:8000" | wc -l)
echo "BKD_RESULT: $BKD_RESULT"

if [ "$BKD_RESULT" -eq "1" ]; then
    echo "Backend server has died. RIP. Now restarting."
    CURRENT_DIR=$(pwd)
    cd /home/ubuntu/Hardon
    Backend/backend_env/bin/python /home/ubuntu/Hadron/Backend/backend/manage.py runserver 0.0.0.0:8000
    cd $CURRENT_DIR
fi