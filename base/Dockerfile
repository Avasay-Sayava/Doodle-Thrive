FROM gcc:latest

RUN apt-get update && apt-get install -y cmake

WORKDIR /usr/base/src/

COPY src/core/ ./core/
COPY src/server ./server/

RUN mkdir -p build
WORKDIR /usr/base/src/build

RUN mkdir -p /usr/base/files/
ENV DOODLE_DRIVE_PATH="/usr/base/files/"

RUN cmake ../server && make

ENTRYPOINT ["./server"]
