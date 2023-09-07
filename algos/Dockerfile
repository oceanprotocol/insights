FROM python:3.8

RUN apt-get update && \
    apt-get install --no-install-recommends -y \
    python3 \
    python3-dev

COPY image_processing.py /tmp/
RUN pip3 install requests
RUN pip3 install Pillow==8.3.2

ENTRYPOINT ["python3", "/tmp/image_processing.py"]