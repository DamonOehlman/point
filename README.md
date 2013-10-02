# point

Use [observable](https://github.com/dominictarr/observable) to monitor
mouse and touch events.


[![NPM](https://nodei.co/npm/point.png)](https://nodei.co/npm/point/)


## Usage

First bind to the element you wish to capture data for.  In this case
let's capture data at the document level:

```js
var point = require('point')(document);
```

Now to receive the pointer events simply pass point a function that will
process the data:

```js
point(function(args) {
  console.log(args);
});
```

The event data is passed to the function as a 4 element array:

```js
[ pageX, pageY, data, originalEvent ]
```

At this stage, the data object `args[2]` simply tells you the type of the
pointer event:

```js
{ type: 'start' }
```

Possible values:

- start
- move
- end

## License(s)

### MIT

Copyright (c) 2013 Damon Oehlman <damon.oehlman@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
