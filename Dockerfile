FROM node:20.11.0

RUN apt-get update && apt-get upgrade -y

COPY ./ /app

WORKDIR /app

RUN yarn
