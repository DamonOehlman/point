# point

Capture touch and mouse events and output a stream of data:

```js
var point = require('point');

window.addEventListener('load', function() {
    var stream = point.capture(document.querySelector('.toucharea'));

    stream.on('data', function(data) {
        console.log(data);
    });
});
```

This would then generate output similar to the following:

```
start:0,215,90
move:0,214,90 
move:0,215,88 
move:0,221,84 
move:0,228,78 
move:0,241,74 
move:0,254,71 
move:0,265,71 
move:0,274,71 
move:0,282,71 
move:0,287,77 
move:0,292,86 
move:0,294,100
move:0,296,116
move:0,297,133
move:0,297,150
move:0,297,163
move:0,300,173
move:0,306,181
move:0,314,188
move:0,325,192
move:0,342,192
move:0,350,187
end:0,350,187
```
