import * as async from 'async';

async.waterfall([
    function(callback) {
        callback(null, 'one', 'two');
    },
    function(arg1, arg2, callback) {
        console.log(arg1, arg2);
        callback("Error", 'three');
    },
    function(arg1, callback) {
        console.log(arg1);
        callback(null, 'done');
    }
], function (err, result) {
    // result now equals 'done'
    console.log('error : ', err);
    console.log('result : ', result);
});