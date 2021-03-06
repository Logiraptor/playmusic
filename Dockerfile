FROM ubuntu


RUN apt-get update && apt-get install -y nodejs npm ruby python-pip

RUN pip install flask
RUN pip install soco
RUN pip install gmusicapi
RUN gem install foreman
RUN npm install -g create-react-app

WORKDIR /workdir
ENV FLASK_APP=main.py


ADD . /workdir

WORKDIR /workdir/client

RUN npm install

WORKDIR /workdir

CMD foreman start
