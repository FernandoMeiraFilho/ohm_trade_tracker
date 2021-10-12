#!/bin/sh

cd /home/ubuntu/projects/ohm_trade_tracker
chmod +x /home/ubuntu/projects/ohm_trade_tracker/execute.sh

yarn install
yarn run_once

chmod +x /home/ubuntu/projects/ohm_trade_tracker/execute.sh
