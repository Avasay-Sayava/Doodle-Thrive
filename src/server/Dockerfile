FROM gcc:latest

RUN apt-get update && apt-get install -y cmake

WORKDIR /usr/src/

COPY src/core/ ./core/
COPY src/server ./server/

RUN mkdir -p build
RUN mkdir -p files
WORKDIR /usr/src/build

ENV DOODLE_DRIVE_PATH="/usr/src/files/"

RUN cmake ../server && make

ENTRYPOINT ["./server"]