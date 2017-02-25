#!/usr/bin/env bash


SCI_RESULT=$(ps aux | grep "/usr/bin/python SimpleCIServer/simple_ci_server.py" | wc -l)
echo "SCI_RESULT: $SCI_RESULT"

if [ "$SCI_RESULT" -eq "1" ]; then
    echo "Simple CI server has died. RIP. Now restarting."
    CURRENT_DIR=$(pwd)
    cd /home/ubuntu/Hadron
    /usr/bin/python SimpleCIServer/simple_ci_server.py &
    cd $CURRENT_DIR
fi


BKD_RESULT=$(ps aux | grep "/home/ubuntu/Hadron/Backend/backend_env/bin/python Backend/backend/manage.py runserver 0.0.0.0:8000" | wc -l)
echo "BKD_RESULT: $BKD_RESULT"

if [ "$BKD_RESULT" -eq "1" ]; then
    echo "Backend server has died. RIP. Now restarting."
    CURRENT_DIR=$(pwd)
    cd /home/ubuntu/Hadron
    Backend/backend_env/bin/python /home/ubuntu/Hadron/Backend/backend/manage.py runserver 0.0.0.0:8000 &
    cd $CURRENT_DIR
fi


NG_RESULT=$(ps aux | grep "angular-cli" | wc -l)
echo "BKD_RESULT: $NG_RESULT"

if [ "$NG_RESULT" -eq "1" ]; then
    echo "Angular server has died. RIP. Now restarting."
    CURRENT_DIR=$(pwd)
    cd /home/ubuntu/Hadron/HadronClient
    ng serve --host 0.0.0.0 &
    cd $CURRENT_DIR
fi