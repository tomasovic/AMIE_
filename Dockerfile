# First stage: build the application
FROM node:18 AS build-deps
RUN yarn add -g typescript ts-node
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json tsconfig.json

RUN yarn install

COPY . .
RUN npx tsc
RUN yarn run compile
RUN ls -la /usr/src/app/dist

# Second stage: run the application
FROM node:18
WORKDIR /usr/src/app
COPY --from=build-deps /usr/src/app/dist ./dist
COPY --from=build-deps /usr/src/app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "dist/launcher.js"]
