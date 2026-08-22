FROM php:8.2-cli

RUN apt-get update \
    && apt-get install -y libpq-dev libzip-dev zip unzip \
    && docker-php-ext-install pdo_pgsql zip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
