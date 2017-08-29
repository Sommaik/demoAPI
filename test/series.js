"use strict";
exports.__esModule = true;
var async = require("async");
async.series([
    function (callback) {
        // do some stuff ...
        callback(null, 'one');
    },
    function (callback) {
        // do some more stuff ...
        callback("ERROR", 'two');
    },
    function (callback) {
        // do some more stuff ...
        callback(null, 'three');
    }
], 
// optional callback
function (err, results) {
    // results is now equal to ['one', 'two']
    console.log('error : ', err);
    console.log('result : ', results);
});
