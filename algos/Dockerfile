FROM python:3.8

RUN apt-get update && \
    apt-get install --no-install-recommends -y \
    gcc \
    python3 \
    python3-pip \
    python3-dev

COPY requirements.txt /tmp/
RUN pip install wheel
RUN pip install -r /tmp/requirements.txt