napos.initialize('foo.bar.demoApp', function(err, token) {
  if (err) { throw err; }
  $('#token').text(JSON.stringify(token));

  napos.rpc.invoke('profile.get', {}, function(err, result) {
    if (err) { throw err; }
    $('#profile').text(JSON.stringify(result));
  });

  napos.rpc.invoke('restaurant.get', {}, function(err, result) {
    if (err) { throw err; }
    $('#restaurant').text(JSON.stringify(result));
  });
});
