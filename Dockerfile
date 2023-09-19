FROM node:18 AS build-deps
RUN yarn add -g typescript ts-node
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json tsconfig.json

RUN yarn install

COPY . .
RUN npx prisma generate

EXPOSE 3000

CMD ["yarn", "run", "start"]
