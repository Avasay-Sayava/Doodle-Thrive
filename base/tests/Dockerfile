FROM gcc:latest

RUN apt-get update && apt-get install -y cmake

WORKDIR /usr/tests/

COPY . .

RUN mkdir -p build
RUN mkdir -p files
WORKDIR /usr/tests/build

ENV DOODLE_DRIVE_PATH="/usr/tests/files/"

RUN cmake ../tests && make

CMD ["./tests"]