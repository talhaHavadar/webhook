#!/bin/sh
cd /home/talha/workspace/talhahavadar.com
git pull origin master
npm install
npm run build
cp build/* /var/www/talhahavadar.com/html/ -r
sudo systemctl restart nginx