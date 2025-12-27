FROM python:latest

WORKDIR /usr/base/client/python/

COPY src/client/client.py ./client.py

ENTRYPOINT ["python", "client.py"]
