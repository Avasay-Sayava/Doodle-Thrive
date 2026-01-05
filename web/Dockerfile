FROM node:latest

WORKDIR /web

COPY package.json ./
RUN npm i

COPY src/ src/
COPY public/ public/

CMD ["npm", "start"]
