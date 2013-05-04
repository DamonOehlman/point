var point = require('../');

window.addEventListener('load', function() {
    var stream = point.capture(document.querySelector('.toucharea'));

    stream.on('data', function(data) {
        console.log(data);
    });
});