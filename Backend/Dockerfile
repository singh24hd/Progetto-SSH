# syntax=docker/dockerfile:1

FROM python:3

WORKDIR /code

COPY requirements.txt /code/requirements.txt

RUN pip3 install  --no-cache-dir  --upgrade -r requirements.txt

COPY ./app /code/app

RUN mkdir /code/data

CMD ["uvicorn", "app.main:app" , "--host", "0.0.0.0", "--port", "80"]
