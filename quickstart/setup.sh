#!/bin/bash

clear
echo "----------------------------------------------------------------------------"
echo "This script will configure your PromptDesk OS installation"
echo "----------------------------------------------------------------------------"
echo ""
echo "Please be sure you have the following information to proceed:"
echo "  1. Docker Compose installed"
echo "  2. OpenAI API Key (can change to different LLM provider later)"
echo "  3. (OPTIONAL) OpenSSL installed"
echo "  4. (OPTIONAL) DNS A record pointing to your server's IP address"
echo "  5. (OPTIONAL) Email address for your SSL certificate install"
echo ""
echo "This process will take approximately 5 minutes"
echo "----------------------------------------------------------------------------"
echo "When you are ready to proceed, press Enter"
echo "To cancel setup, press Ctrl+C"

# Confirm removal of existing setup
if [ -d ./promptdesk ]; then
    echo ""
    echo "Existing 'promptdesk' directory found. Choose an option:"
    echo "1) Start app with 'docker-compose up'"
    echo "2) Quit setup"
    echo "3) Delete 'promptdesk' and setup again"
    read -r user_choice

    case $user_choice in
        1)
            echo "Starting app with 'docker compose up'..."
            docker compose up
            ;;
        2)
            echo "Setup canceled. Exiting..."
            exit 0
            ;;
        3)
            echo "Removing existing 'promptdesk' directory..."
            rm -rf ./promptdesk
            echo "Removed. Proceeding with setup..."
            # Insert your setup commands here
            ;;
        *)
            echo "Invalid option. Exiting..."
            exit 1
            ;;
    esac

else
    read -r proceed
fi

# Check for Docker Compose and OpenSSL installation
required_commands=("docker compose" "openssl")
install_guides=("https://docs.docker.com/compose/install/" "https://www.openssl.org/source/")

for i in "${!required_commands[@]}"; do
  if ! [ -x "$(command -v ${required_commands[$i]})" ]; then
    echo "Error: ${required_commands[$i]} is not installed. Please install it and try again." >&2
    echo "Installation guide: ${install_guides[$i]}" >&2
    exit 1
  fi
done

#check if files can be written to the current directory
if [ -w . ]; then
    :
else
    echo "This directory is not writable. Please run this script in a directory where you have write permissions"
    exit 1
fi

mkdir -p promptdesk && cd promptdesk &&
mkdir -p nginx

#get option of if they want to: 1) setup a domain name with ssl or 2) just keep existing setup
echo "Do you want to setup a domain name with SSL? (y/n)"
read -r setup_domain

conf_url="https://raw.githubusercontent.com/promptdesk/promptdesk/main/quickstart/nginx"
compose_url="https://raw.githubusercontent.com/promptdesk/promptdesk/main/quickstart"
certbot_config_url="https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs"

if [[ "$setup_domain" == "y" || "$setup_domain" == "Y" ]] && [ ! -f "./certbot/conf/live/$domain_name/fullchain.pem" ]; then

    echo "Please enter your domain name (e.g. example.com, subdomain.example.com)"
    read -r domain_name
    echo "Please enter your email address for SSL certificate install"
    read -r email_address

    curl -L -o ./nginx/default.conf "$conf_url/certbot-setup.conf"

    sed -i'' -e "s/\${DOMAIN}/$domain_name/g" ./nginx/default.conf

    curl -L -o ./docker-compose-certbot-setup.yml "$compose_url/docker-compose-certbot-setup.yml"

    if [ ! -f ./certbot/conf/ssl-dhparams.pem ]; then
        mkdir -p ./certbot/conf
        curl -L -o ./certbot/conf/options-ssl-nginx.conf "$certbot_config_url/options-ssl-nginx.conf"
        openssl dhparam -out ./certbot/conf/ssl-dhparams.pem 2048
    fi

    docker compose -f docker-compose-certbot-setup.yml run --rm certbot certonly --webroot --webroot-path /var/www/certbot/ --dry-run -d "$domain_name" --agree-tos -m "$email_address"
    docker compose -f docker-compose-certbot-setup.yml run --rm certbot certonly --webroot --webroot-path /var/www/certbot/ -d "$domain_name" --agree-tos -m "$email_address"

    curl -L -o ./nginx/default.conf "$conf_url/default-ssl.conf"

    sed -i'' -e "s/\${DOMAIN}/$domain_name/g" ./nginx/default.conf

    curl -L -o ./docker-compose.yml "$compose_url/docker-compose-secure.yml"

else
    echo "Setup already exists or domain not set. To reconfigure, remove ./promptdesk directory and rerun."
fi


if [ "$setup_domain" = "n" ] || [ "$setup_domain" = "N" ]; then
    curl -L -o ./nginx/default.conf "$conf_url/default.conf"
    curl -L -o ./docker-compose.yml "$compose_url/docker-compose.yml"
fi

docker compose up