#!/bin/bash

# Clear the screen
clear

# Welcome and prerequisites check
echo "----------------------------------------------------------------------------"
echo "PromptDesk OS Configuration Script"
echo "----------------------------------------------------------------------------"
echo
echo "Prerequisites:"
echo "  1. Docker Compose"
echo "  2. OpenAI API Key"
echo "  3. (Optional) OpenSSL for SSL certificate generation"
echo "  4. (Optional) A domain/subdomain pointing to your server"
echo "  5. (Optional) An email address for SSL certificate"
echo
echo "This process takes approximately 5 minutes."
echo "----------------------------------------------------------------------------"
echo "Press Enter to proceed or Ctrl+C to exit."
read -p ""

# Cleanup any previous installations
if [ -d ./promptdesk ]; then
    echo "Cleaning up previous installation..."
    rm -rf ./promptdesk
fi

# Check for Docker Compose installation
if ! command -v docker-compose &> /dev/null; then
    echo "Error: Docker Compose is not installed. Please install it to continue."
    echo "Installation guide: https://docs.docker.com/compose/install/"
    exit 1
fi

# Check for OpenSSL installation for SSL setup
if ! command -v openssl &> /dev/null; then
    echo "Notice: OpenSSL is not installed. SSL setup will be skipped."
    openssl_installed=false
else
    openssl_installed=true
fi

# Check directory write permissions
if [ ! -w "." ]; then
    echo "Error: This directory is not writable. Please run the script in a directory with write permissions."
    exit 1
fi

# Create necessary directories
mkdir -p promptdesk/nginx

# Domain setup prompt
echo "Do you want to setup a domain name with SSL? (y/n)"
read -r setup_domain

# Setup with domain name and SSL
if [[ "$setup_domain" =~ ^[Yy]$ ]] && [ "$openssl_installed" = true ]; then
    # Domain and email input
    echo "Please enter your domain name (e.g., example.com):"
    read -r domain_name
    echo "Please enter your email address for SSL certificate installation:"
    read -r email_address

    # Configuration files setup
    nginx_conf="./promptdesk/nginx/default.conf"
    compose_file="./promptdesk/docker-compose.yml"
    certbot_conf="./promptdesk/certbot/conf"

    # Prepare Nginx and Docker Compose configurations
    cp ./nginx/certbot-setup.conf "$nginx_conf"
    sed -i'' -e "s/\${DOMAIN}/$domain_name/g" "$nginx_conf"
    cp ./docker-compose-certbot-setup.yml "$compose_file"

    # SSL certificate preparation
    if [ ! -f "$certbot_conf/ssl-dhparams.pem" ]; then
        echo "Downloading SSL configuration..."
        mkdir -p "$certbot_conf"
        curl -sSL -o "$certbot_conf/options-ssl-nginx.conf" "https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf"
        openssl dhparam -out "$certbot_conf/ssl-dhparams.pem" 2048
    fi

    # Obtain SSL certificate
    echo "Obtaining SSL certificate for $domain_name..."
    docker-compose -f "$compose_file" run --rm certbot certonly --webroot --webroot-path /var/www/certbot/ --dry-run -d "$domain_name" --agree-tos -m "$email_address"
    # Note: Remove --dry-run for actual deployment

    # Switch to SSL-enabled Nginx configuration
    cp ./nginx/default-ssl.conf "$nginx_conf"
    sed -i'' -e "s/\${DOMAIN}/$domain_name/g" "$nginx_conf"

elif [[ "$setup_domain" =~ ^[Nn]$ ]] || [ "$openssl_installed" = false ]; then
    # Non-SSL setup or SSL skipped due to missing OpenSSL
    cp ./nginx/default.conf ./promptdesk/nginx/default.conf
    cp ./docker-compose.yml ./promptdesk/docker-compose.yml
fi

# Final setup completion message
echo "Setup completed successfully!"

echo "----------------------------------------------------------------------------"
echo "To start PromptDesk, run the following commands:"
echo "  cd promptdesk"
echo "  docker-compose up -d"