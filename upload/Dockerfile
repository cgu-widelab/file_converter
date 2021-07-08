FROM node:14.16.0-alpine3.13

WORKDIR /home/node/app

RUN apk add --update \
    git \
    openssh-client \
    && rm -rf /var/cache/apk/* \
    && chown node . \
    && chgrp node .

USER node
COPY --chown=node ./package.json ./
RUN npm install

COPY --chown=node ./ ./