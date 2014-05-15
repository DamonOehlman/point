var pull = require('pull-stream');
var observe = require('pull-observable');
var point = require('..');
var eve = require('eve');

eve.on('pointer.*', function(x, y) {
  console.log('captured: ' + eve.nt() + ' @ ', x, y);
});

pull(
  observe(point(document)),
  pull.drain(function(args) {
    var type = (args[2] || {}).type;

    eve.apply(null, ['pointer.' + type, args[3]].concat(args.slice(0, 2)));
  })
);

