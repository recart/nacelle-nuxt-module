FROM node:14

ARG NPM_REGISTRY_URL
ARG NPM_AUTH_TOKEN

WORKDIR /app

RUN echo "//${NPM_REGISTRY_URL}/:_authToken=${NPM_AUTH_TOKEN}" > /app/.npmrc

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm ci

COPY . .