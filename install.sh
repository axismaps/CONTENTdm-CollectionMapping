sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install -y imagemagick php5-imagick nodejs npm git
cd ~
git clone https://github.com/axismaps/denison.git
cd denison
sudo npm install -g bower
ln -s /usr/bin/nodejs /usr/bin/node
bower install --allow-root
sudo npm install -g gulp
npm install
gulp
cd /var/www/html/
rm *
cp -r ~/public/. /var/www/html
cd /var/www/html/
sudo chown -R www-data:www-data php
sudo chown -R www-data:www-data csv
service apache2 restart
