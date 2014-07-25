sudo mkdir -p /data/db/
sudo chown `id -u` /data/db/
# if see `chown: invalid user: 'mongodb:mongodb'`, check /etc/passwd to see if there is a similar user (ex. mongod)

# since mongodb 2.6, the default database is relocated.
sudo mkdir -p /var/lib/mongodb
sudo chown `id -u` /var/lib/mongodb
