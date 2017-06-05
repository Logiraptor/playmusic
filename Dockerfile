FROM node

RUN npm install -g create-react-app

RUN apt-get update && apt-get install -y ruby python-pip
RUN pip install flask
RUN pip install soco
RUN pip install gmusicapi
RUN gem install foreman

WORKDIR /workdir
ENV FLASK_APP=main.py


ADD . /workdir

ENTRYPOINT foreman start
