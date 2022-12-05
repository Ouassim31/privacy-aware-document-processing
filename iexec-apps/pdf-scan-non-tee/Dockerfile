FROM ubuntu:latest

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip

RUN pip3 install \
    PyPDF2 \
    pdf2image \
    opencv-python-headless \
    pytesseract

COPY ./src/app.py /app/app.py
ENTRYPOINT ["python3", "/app/app.py"]