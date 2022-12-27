FROM python:3.7.3-alpine3.10

RUN apk update \
    && apk add --virtual build-deps gcc python3-dev musl-dev \
    && apk add postgresql \
    && apk add postgresql-dev \
    && pip install psycopg2 \
    && apk add jpeg-dev zlib-dev libjpeg \
    && pip install Pillow \
    && apk del build-deps

RUN pip3 install \
    PyPDF2

COPY ./src/app.py /app/app.py
ENTRYPOINT ["python3", "/app/app.py"]
