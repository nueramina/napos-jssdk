napos.initialize('sc.scfH5', function(err, token) {
  if (err) { throw err; }
  $('#token').text(JSON.stringify(token));

  napos.rpc.invoke('profile.get', {}, function(err, result) {
    if (err) { throw err; }
    $('#profile').text(JSON.stringify(result));
  });
  
  napos.rpc.invoke('restaurant.getAll', {}, function(err, result) {
    if (err) { throw err; }
    $('#allRestaurants').text(JSON.stringify(result));
  });

  napos.rpc.invoke('restaurant.get', {}, function(err, result) {
    if (err) { throw err; }
    $('#currentRestaurant').text(JSON.stringify(result));
  });

  napos.rpc.invoke('view.setTitle', { title: 'Demo App' }, function(err, result) {
    if (err) { throw err; }
  });
});
