FROM bitnami/mongodb:latest

USER root

COPY Backend/mongo_mocks /docker-entrypoint-initdb.d/mongo_mocks
COPY docker/mongo/01-seed.sh /docker-entrypoint-initdb.d/01-seed.sh

RUN sed -i 's/\r$//' /docker-entrypoint-initdb.d/01-seed.sh \
 && chmod +x /docker-entrypoint-initdb.d/01-seed.sh \
 && chown -R 1001:0 /docker-entrypoint-initdb.d

USER 1001
