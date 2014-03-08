sudo apt-get install python-software-properties
sudo apt-add-repository ppa:chris-lea/node.js
sudo apt-get update

sudo apt-get install nodejs
node -v
npm -v
# change ownership of folder to avoild using sudo for npm install
sudo chown -R `whoami` ~/.npm
sudo chown -R `whoami` ~
