FROM postgres:15-alpine

COPY db/init.sql /docker-entrypoint-initdb.d/init.sql