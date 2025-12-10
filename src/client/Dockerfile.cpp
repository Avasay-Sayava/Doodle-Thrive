FROM gcc:latest

RUN apt-get update && apt-get install -y cmake

WORKDIR /usr/client/
RUN mkdir -p code
WORKDIR /usr/client/code/

COPY src/client/cppClient.cpp .
COPY src/client/cppClient.h .
COPY src/client/main.cpp .
COPY src/client/CMakeLists.txt .

RUN mkdir -p build
WORKDIR /usr/client/build

RUN cmake ../code && make

ENTRYPOINT ["./cpp-client"]