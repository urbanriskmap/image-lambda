'use strict'
const fs = require("fs");
const path = require("path");
const sourceFile = path.join(__dirname, "/fixture/event.json");
const event = JSON.parse(fs.readFileSync(sourceFile));
const eventHandler = require("../index").handler;
const AWS = require('aws-sdk');

AWS.config.update({region: 'ap-northeast-1'});
eventHandler(event, null, (error, data) => {
    if (error) {
        console.error(error);
    } else {
        console.log(data);
    }
});
