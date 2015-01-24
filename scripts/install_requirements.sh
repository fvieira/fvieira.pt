#! /bin/bash
echo "Installing ruby..."
sudo aptitude install ruby ruby-dev
echo
echo "Installing Jekyll"
sudo gem install jekyll
echo
echo "Installing Jekyll Asset Pipeline Reborn"
sudo gem install japr
echo
echo "Now install s3cmd manually"
