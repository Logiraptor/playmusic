#!/bin/bash

curl -s https://api.github.com/repos/Logiraptor/playmusic/releases/latest | grep "/arm-release.zip" | cut -d : -f 2,3 | tr -d \" | wget -qi -

unzip arm-release.zip

sudo cp playmusic.service /etc/systemd/system/playmusic.service
sudo systemctl enable playmusic
sudo systemctl start playmusic
