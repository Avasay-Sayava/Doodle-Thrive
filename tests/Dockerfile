FROM gcc:latest

RUN apt-get update && apt-get install -y cmake

COPY . /usr/tests/

WORKDIR /usr/tests/

RUN mkdir build
WORKDIR /usr/tests/build

RUN cmake .. && make

CMD ["./tests"]