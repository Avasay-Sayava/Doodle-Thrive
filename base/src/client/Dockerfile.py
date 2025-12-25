FROM python:3.11-slim

WORKDIR /usr/client/

COPY src/client/pyClient.py ./pyClient.py

ENTRYPOINT ["python", "pyClient.py"]