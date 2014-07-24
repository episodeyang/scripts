# this is the master setup script
sudo apt-get update
sudo apt-get -y upgrade
sudo apt-get vim

sudo apt-get install rcconf
sudo apt-get install build-essential
sudo apt-get install libssl-dev
sudo apt-get install git-core
sudo apt-get remove gyp
sh ./node_npm_install/install_nodejs_npm.sh
sudo npm install -g grunt grunt-cli bower mocha pm2@latest
sudo apt-get install python-setuptools
sudo apt-get easy_install
