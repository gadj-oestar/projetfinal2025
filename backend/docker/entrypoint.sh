#!/bin/sh
set -e

# Render fournit le port à écouter dans $PORT
export PORT="${PORT:-10000}"
echo "Listen ${PORT}" > /etc/apache2/ports.conf

# Certificat de l'autorité du serveur MySQL (Aiven), fourni en variable d'environnement
if [ -n "$MYSQL_SSL_CA" ]; then
    printf '%s\n' "$MYSQL_SSL_CA" > /var/www/html/config/mysql-ca.pem
else
    cp /etc/ssl/certs/ca-certificates.crt /var/www/html/config/mysql-ca.pem
fi

# Clés JWT (régénérées si absentes)
php bin/console lexik:jwt:generate-keypair --skip-if-exists --no-interaction

php bin/console cache:clear --no-interaction
php bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration

chown -R www-data:www-data var config/jwt
exec apache2-foreground
