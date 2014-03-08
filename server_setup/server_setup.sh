sudo apt-get update
sudo apt-get -y upgrade
sudo apt-get vim

sudo apt-get install rcconf
sudo apt-get install build-essential
sudo apt-get install libssl-dev
sudo apt-get install git-core
sh install_nodejs_npm.sh
sudo npm install -g grunt grunt-cli bower mocha
sudo apt-get install python-setuptools
sudo apt-get easy_install supervisor

curl https://raw.github.com/gist/176149/88d0d68c4af22a7474ad1d011659ea2d27e35b8d/supervisord.sh > supervisord 
chmod +x supervisord 
sudo mv supervisord /etc/init.d/supervisord 

sudo rcconf

sudo echo supervisord_conf > supervisord.conf 
sudo mv supervisord.conf /etc/supervisord.conf 

;sudo vim /etc/supervisord.conf

;chmod=0777 ; sockef file mode (default 0700)


