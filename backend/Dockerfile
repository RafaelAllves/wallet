FROM python:3.9

WORKDIR /code

ADD requirements.txt .

RUN pip install -r requirements.txt

ADD . .

EXPOSE 8000
