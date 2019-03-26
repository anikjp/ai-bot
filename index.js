// dependencies
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const http = require('https');
const realChat = require('./controller/messageWebhook');
var unirest = require("unirest");
let errorResposne = {
    results: []
};
var port = process.env.PORT || 8080;

// create serve and configure it.
const server = express();
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.get('/', function (req, res) {
  res.send('hello world')
});

server.post('/real-chat', realChat.dialogFlowAgent);

server.listen(port, function () {
    console.log("Server is up and running...");
});
