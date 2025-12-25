FROM node:latest

WORKDIR /api

COPY package.json ./
RUN npm i

COPY lib/ lib/
COPY src/ src/

ENTRYPOINT ["npm", "start"]
