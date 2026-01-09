FROM node:latest

WORKDIR /web

COPY package.json ./
RUN npm i

COPY src/ src/
COPY public/ public/

RUN npm run build

RUN npm install -g serve
ENTRYPOINT ["npx", "serve", "-s", "build", "-l", "3000"]
