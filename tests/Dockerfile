FROM gcc:latest

RUN apt-get update && apt-get install -y cmake

WORKDIR /usr/tests/

COPY . .

RUN mkdir -p build
WORKDIR /usr/tests/build

RUN cmake ../tests && make

CMD ["./tests"]