FROM node:latest

WORKDIR /api

COPY package.json ./
RUN npm i

COPY lib/ lib/
COPY src/ src/
COPY tests/ tests/

ENTRYPOINT ["npm", "test"]
