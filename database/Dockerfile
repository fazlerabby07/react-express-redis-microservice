FROM mysql:latest

COPY ./startup.sql /tmp

CMD [ "mysqld", "--init-file=/tmp/./startup.sql" ]