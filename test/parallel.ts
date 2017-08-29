import * as async from 'async';

    async.parallel([
        function (callback) {
            setTimeout(function () {
                console.log('one');
                callback(null, 'one');
            }, 200);
        },
        function (callback) {
            setTimeout(function () {
                console.log('two');
                callback(null, 'two');
            }, 100);
        }
    ],
    // optional callback
    function (err, results) {
        console.dir(results);
    });