FROM gcc:latest

RUN apt-get update && apt-get install -y cmake

WORKDIR /usr/base/client/
RUN mkdir -p code
WORKDIR /usr/base/client/code/

COPY src/client/client.cpp .
COPY src/client/client.h .
COPY src/client/main.cpp .
COPY src/client/CMakeLists.txt .

RUN mkdir -p build
WORKDIR /usr/base/client/build

RUN cmake ../code && make

ENTRYPOINT ["./cpp-client"]
