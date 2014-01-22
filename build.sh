#!/bin/bash
#
# Copies all static files into 'dist' folder
#
# ./build.sh

rm -rf dist
mkdir dist

cp -aR js dist/js
cp -aR scripts dist/scripts
cp -aR theme dist/theme
cp -aR images dist/images
cp slide_config.js dist/slide_config.js
cp slides.html dist/index.html

read -p "dist created. Would you like to open it in a browser? [Ny] " -n 1
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  cd dist && open index.html
fi
