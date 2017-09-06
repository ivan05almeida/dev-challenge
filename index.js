var fs = require('fs');
var schemaInspector = require('schema-inspector');
var csvjson = require('csvjson');
var lodash = require('lodash');
var googleLibphonenumber = require('google-libphonenumber').PhoneNumberFormat;

var csv_file = fs.readFileSync('src/input.csv', { encoding : 'utf8'});
var json_out = csvjson.toObject(csv_file, {});

var test = lodash.ma


console.log(json_out);