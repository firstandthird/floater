/*!
  * Floater - a javascript library to make an element float
  * v0.0.2
  * https://github.com/jgallen23/floater
  * copyright JGA 2011
  * MIT License
  */

!function (name, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition();
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition);
  else this[name] = definition();
}('Floater', function() {

var aug = function() {
  var args = Array.prototype.slice.call(arguments);
  var org = args.shift();
  if (typeof org === "function") org = org.prototype;
  for (var i = 0, c = args.length; i < c; i++) {
    var prop = args[i];
    for (var name in prop) {
      org[name] = prop[name];
    }
  }
  return org;
};

var Floater = function(options) { 
  var defaults = {
    topPadding: 10,
    stopPoint: -1,
    startPoint: 0
  };
  var opts = aug({}, defaults, options);
  if (!opts.el)
    throw "el is required";

  opts.el.css('top', opts.startPoint).fadeIn();
  var floating = false;

  var startFloat = function() {
    floating = true;
    opts.el.css({
      position: 'fixed',
      top: opts.topPadding 
    });
  };
  var stopFloat = function(posY) {
    floating = false;
    opts.el.css({
      position: 'absolute',
      top: posY 
    });
  };
  var onScroll = function(e) {
    var scrollY = $(window).scrollTop();
    if (scrollY > opts.startPoint) {
      if (opts.stopPoint != -1 && scrollY > opts.stopPoint) {
        stopFloat(opts.el.offset().top);
      } else if (!floating) {
        startFloat();
      }
    } else if (scrollY < opts.startPoint && floating) {
      stopFloat(opts.startPoint);
    }
  };
  $(window).scroll(onScroll);
};

return Floater;
});
