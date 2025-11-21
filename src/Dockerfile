FROM gcc:latest

RUN apt-get update && apt-get install -y cmake

WORKDIR /usr/src/

COPY . .

RUN mkdir -p build
WORKDIR /usr/src/build

RUN cmake ../src && make

CMD ["./app"]
