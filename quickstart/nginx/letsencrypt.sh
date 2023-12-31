#!/bin/bash 

curl -L --create-dirs -o ../certbot/conf/options-ssl-nginx.conf https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf
openssl dhparam -out ../certbot/conf/ssl-dhparams.pem 2048