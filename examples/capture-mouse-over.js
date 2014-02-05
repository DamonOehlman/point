var point = require('../')(document, { over: true });

point(function(points) {
  console.log(points);
});