suite('floater', function() {
  this.timeout(510); // Script waits 500ms for recalc
  var floatie;

  beforeEach(function() {
    window.scrollTo(0,0);
    $('#fixture').empty().html($('#clone .wrapper').clone());
    floatie = $('#fixture .floater').floater();
  });

  test('event fired on scroll', function(done) {
    floatie.on('floatStart', function() {
      assert.ok(true);
      done();
    });

    window.scrollTo(0, 100);
  });

  test.skip('event fired on scroll end', function(done) {
    floatie.on('floatStop', function() {
      assert.ok(true);
      done();
    });

    window.scrollTo(0, 130);
  });
 
  test('placeholder should be created on scroll', function(done){
    floatie.on('floatStart', function() {
      assert.equal($('.floater-placeholder').length, 1);
      done();
    });

    window.scrollTo(0, 130);
  });

  test('should only start once start point is hit', function(done){
    floatie.floater('setStartPoint', 250);

    window.scrollTo(0, 130);

    floatie.on('floatStart', function() {
      assert.ok(true);
      done();
    });

    window.scrollTo(0, 300);
  });

  test.skip('should end once stop point is hit', function(done){
    floatie.floater('setStopPoint', 300);

    floatie.on('floatStop', function() {
      assert.ok(true);
      done();
    });

    window.scrollTo(0, 400);
  });

});