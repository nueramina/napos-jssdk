function stringify(json) {
  return JSON.stringify(json, null, 2);
}

napos.initialize('sc.scfH5', function(err, token) {
  if (err) { throw err; }
  $('#token').text(stringify(token));

  napos.rpc.invoke('profile.get', {}, function(err, result) {
    if (err) { throw err; }
    $('#profile').text(stringify(result));
  });
  
  napos.rpc.invoke('restaurant.getAll', {}, function(err, result) {
    if (err) { throw err; }
    $('#allRestaurants').text(stringify(result));
  });

  napos.rpc.invoke('restaurant.get', {}, function(err, result) {
    if (err) { throw err; }
    $('#currentRestaurant').text(stringify(result));
  });

  napos.rpc.invoke('view.setTitle', { title: 'Demo App' }, function(err, result) {
    if (err) { throw err; }
  });
});
