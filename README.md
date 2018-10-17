# restful-web-api
Udacity Blockchain Nanodegree - Project 3: RESTful Web API with Node.js

## Framework used

Express.js

### Setup
```
$ git clone https://github.com/anoopmundathan/restful-web-api.git
$ cd restful-web-api
```
### Install
```
$ npm i
```
### Run
``` 
$ node server.js
```
### How to test the end point?

Use postman or CURL on the terminal to send the requests to the base url http://localhost:8000 with one of the below supported endpoints:

- POST
http://localhost:8000/block

example:

```
curl -X "POST" "http://localhost:8000/block" -H 'Content-Type: application/json' -d $'{"body":"test data"}'
```
example output:
```
{
    "hash": "e6e67132bafc539556bf70b120ae1dc4d429a53a331f85acfcb5044609e159ee",
    "height": 0,
    "body": "test data",
    "time": "1539811189",
    "previousBlockHash": ""
}
```

- GET
http://localhost:8000/block/{BLOCK_HEIGHT}

example
```
curl http://localhost:8080/block/0
```
example output:
```
{
    "hash": "e6e67132bafc539556bf70b120ae1dc4d429a53a331f85acfcb5044609e159ee",
    "height": 0,
    "body": "test data",
    "time": "1539811189",
    "previousBlockHash": ""
}
```
