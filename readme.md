# [Colors (new)](https://kleurtj.es/jip)


This project lets you easily store and share your color palettes. 

## Setup

You'll need to install the relevant packages (`npm install`) and set up the `.env` file, which you can base off of the `sample.env` file.

You'll also need a MongoDB server running with a `colors` database. Atlas will work for this, also.

## Further configuration

Some other options you can set in the `.env` file are as follows

`DEV_HOST`: the URL to redirect to when `PROD` is false

`PORT` or `DEV_PORT`: the port to run the app on

`DB`: the MongoDB URL

`AUTH_REDIRECT`: URL to redirect to after signing in
