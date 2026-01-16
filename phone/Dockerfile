FROM node:latest

WORKDIR /app
COPY package.json ./
RUN npm i

COPY . .
RUN npm run build-web

RUN npm install -g serve
ENTRYPOINT ["npx", "serve", "-s", "dist", "-l"]
