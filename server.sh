#!/bin/bash

: ${GOOGLE_EMAIL?"Need to set GOOGLE_EMAIL"}
: ${GOOGLE_PASSWORD?"Need to set GOOGLE_PASSWORD"}

set -e

docker build -t playmusic .

docker run -it -e GOOGLE_EMAIL=$GOOGLE_EMAIL -e GOOGLE_PASSWORD=$GOOGLE_PASSWORD -p 8080 --network host playmusic