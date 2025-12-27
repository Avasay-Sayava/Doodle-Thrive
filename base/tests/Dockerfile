FROM gcc:latest

RUN apt-get update && apt-get install -y cmake

WORKDIR /usr/base/tests/

COPY . .

RUN mkdir -p build
RUN mkdir -p files
WORKDIR /usr/base/tests/build

ENV DOODLE_DRIVE_PATH="/usr/base/tests/files/"

RUN cmake ../tests && make

CMD ["./tests"]
