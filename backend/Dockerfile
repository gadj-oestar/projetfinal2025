# Image de production du back Symfony (utilisée par Render)
FROM php:8.3-apache

RUN apt-get update \
    && apt-get install -y --no-install-recommends libicu-dev libzip-dev unzip git \
    && docker-php-ext-install pdo_mysql intl opcache zip \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
COPY docker/apache.conf /etc/apache2/sites-available/000-default.conf
RUN a2enmod rewrite \
    # Rend les variables d'environnement de Render visibles par Symfony
    && echo 'variables_order = "EGPCS"' > /usr/local/etc/php/conf.d/env.ini

WORKDIR /var/www/html
ENV APP_ENV=prod APP_DEBUG=0 COMPOSER_ALLOW_SUPERUSER=1

COPY composer.json composer.lock symfony.lock ./
RUN composer install --no-dev --no-scripts --no-interaction --prefer-dist --optimize-autoloader \
    --ignore-platform-req=ext-mongodb

COPY . .
RUN composer dump-autoload --no-dev --classmap-authoritative \
    && php bin/console assets:install public --no-interaction \
    && chmod +x docker/entrypoint.sh

CMD ["docker/entrypoint.sh"]
