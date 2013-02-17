/*!
 * floater - a plugin to make element float on the screen
 * v0.2.2
 * https://github.com/jgallen23/floater
 * copyright JGA 2013
 * MIT License
*/

/*!
 * fidel - a ui view controller
 * v2.2.0
 * https://github.com/jgallen23/fidel
 * copyright JGA 2012
 * MIT License
*/

(function(w, $) {

var _id = 0;
var Fidel = function(obj) {
  this.obj = obj;
};

Fidel.prototype.__init = function(options) {
  $.extend(this, this.obj);
  this.id = _id++;
  this.obj.defaults = this.obj.defaults || {};
  $.extend(this, this.obj.defaults, options);
  $('body').trigger('FidelPreInit', this);
  this.setElement(this.el || $('<div/>'));
  if (this.init) {
    this.init();
  }
  $('body').trigger('FidelPostInit', this);
};
Fidel.prototype.eventSplitter = /^(\w+)\s*(.*)$/;

Fidel.prototype.setElement = function(el) {
  this.el = el;
  this.getElements();
  this.delegateEvents();
  this.dataElements();
  this.delegateActions();
};

Fidel.prototype.find = function(selector) {
  return this.el.find(selector);
};

Fidel.prototype.proxy = function(func) {
  return $.proxy(func, this);
};

Fidel.prototype.getElements = function() {
  if (!this.elements)
    return;

  for (var selector in this.elements) {
    var elemName = this.elements[selector];
    this[elemName] = this.find(selector);
  }
};

Fidel.prototype.dataElements = function() {
  var self = this;
  this.find('[data-element]').each(function(index, item) {
    var el = $(item);
    var name = el.data('element');
    self[name] = el;
  });
};

Fidel.prototype.delegateEvents = function() {
  var self = this;
  if (!this.events)
    return;
  for (var key in this.events) {
    var methodName = this.events[key];
    var match = key.match(this.eventSplitter);
    var eventName = match[1], selector = match[2];

    var method = this.proxy(this[methodName]);

    if (selector === '') {
      this.el.on(eventName, method);
    } else {
      if (this[selector] && typeof this[selector] != 'function') {
        this[selector].on(eventName, method);
      } else {
        this.el.on(eventName, selector, method);
      }
    }
  }
};

Fidel.prototype.delegateActions = function() {
  var self = this;
  self.el.on('click', '[data-action]', function(e) {
    var el = $(this);
    var action = el.attr('data-action');
    if (self[action]) {
      self[action](e, el);
    }
  });
};

Fidel.prototype.on = function(eventName, cb) {
  this.el.on(eventName+'.fidel'+this.id, cb);
};

Fidel.prototype.one = function(eventName, cb) {
  this.el.one(eventName+'.fidel'+this.id, cb);
};

Fidel.prototype.emit = function(eventName, data, namespaced) {
  var ns = (namespaced) ? '.fidel'+this.id : '';
  this.el.trigger(eventName+ns, data);
};

Fidel.prototype.hide = function() {
  if (this.views) {
    for (var key in this.views) {
      this.views[key].hide();
    }
  }
  this.el.hide();
};
Fidel.prototype.show = function() {
  if (this.views) {
    for (var key in this.views) {
      this.views[key].show();
    }
  }
  this.el.show();
};

Fidel.prototype.destroy = function() {
  this.el.empty();
  this.emit('destroy');
  this.el.unbind('.fidel'+this.id);
};

Fidel.declare = function(obj) {
  var FidelModule = function(el, options) {
    this.__init(el, options);
  };
  FidelModule.prototype = new Fidel(obj);
  return FidelModule;
};

//for plugins
Fidel.onPreInit = function(fn) {
  $('body').on('FidelPreInit', function(e, obj) {
    fn.call(obj);
  });
};
Fidel.onPostInit = function(fn) {
  $('body').on('FidelPostInit', function(e, obj) {
    fn.call(obj);
  });
};

$.declare = function(name, obj) {

  $.fn[name] = function() {
    var args = Array.prototype.slice.call(arguments);
    var options = args.shift();
    var methodValue;
    var els;

    els = this.each(function() {
      var $this = $(this);

      var data = $this.data(name);

      if (!data) {
        var View = Fidel.declare(obj);
        var opts = $.extend({}, options, { el: $this });
        data = new View(opts);
        $this.data(name, data); 
      }
      if (typeof options === 'string') {
        methodValue = data[options].apply(data, args);
      }
    });

    return methodValue || els;
  };

  $.fn[name].defaults = obj.defaults || {};

};

$.Fidel = Fidel;

w.Fidel = Fidel;
})(window, window.jQuery || window.Zepto);

(function($) {
  $.declare('floater', {
    defaults: {
      topPadding: 0,
      stopPoint: -1,
      startPoint: -1,
      relative: false,
      offsetX: 0,
      offsetY: 0,
      debug: false
    },

    init: function() {
      this.enabled = true;
      this.resetStyles = {
        position: this.el.css('position'),
        top: this.el.css('top'),
        left: this.el.css('left'),
        width: this.el.css('width')
      };

      var offset = this.el.offset();
      this.topPadding = parseInt(this.topPadding, 10);
      this.startPoint = this.startPoint == -1 ? (offset.top - this.topPadding) : this.startPoint;
      this.height = this.el.outerHeight(true);

      if (typeof this.stopPoint == 'object' && this.stopPoint.length) {
        this.stopPoint = this.stopPoint.offset().top;
      }

      this.floating = false;
      $(window).on('scroll', this.proxy(this.onScroll));
      this.onScroll();
      if (this.debug) {
        this.showDebug();
      }
    },

    setStartPoint: function(point) {
      this.startPoint = point;
    },

    setStopPoint: function(point) {
      this.stopPoint = point;
    },

    showDebug: function() {
      var showLine = function(top) {
        $('<div/>').css({
          position: 'absolute',
          height: '1px',
          width: '100%',
          background: 'red',
          top: top 
        }).appendTo('body');
      };
      showLine(this.startPoint);
      showLine(this.stopPoint);
    },

    createPlaceholder: function() {
      var classes = this.el[0].className || '';
      return $('<div/>')
        .addClass('floater-placeholder ' + classes)
        .css({ 
          width: this.el.css('width'),
          height: this.el.css('height'),
          visibility: 'hidden'
        });
    },

    startFloat: function() {
      if (this.floating) {
        return;
      }
      this.floating = true;
      var offset = this.el.offset();
      if (!this.el.prev().hasClass('floater-placeholder')) {
        this.el.before(this.createPlaceholder());
      }
      this.el.css({
        position: 'fixed',
        top: this.topPadding + 'px',
        left: offset.left + this.offsetX,
        width: this.el.css('width')
      });
      this.emit('floatStart');
    },

    stopFloat: function(y) {
      if (!this.floating) {
        return;
      }
      this.floating = false;
      this.el.prev().remove();
      this.el.css({
        position: '',
        top: '',
        left: '',
        width: '' 
      });
      this.emit('floatStop');
    },

    freezeFloat: function(y) {
      if (!this.floating) {
        return;
      }
      this.floating = false;
      this.el.css({
        position: 'absolute',
        top: y,
        left: '',
        width: this.el.css('width')
      });
      this.emit('floatStop');

    },

    onScroll: function(e) {
      if (!this.enabled) {
        return;
      }
      var scrollY = $(window).scrollTop();
      if (scrollY > this.startPoint) {
        if (this.stopPoint != -1 && (scrollY + this.height + this.topPadding) > this.stopPoint) {
          if (this.floating) {
            this.freezeFloat(this.stopPoint - this.height);
          }
        } else if (!this.floating) {
          this.startFloat();
        }
      } else if (this.floating && scrollY < this.startPoint) { //top of screen
        this.stopFloat();
      }
    },

    on: function() {
      this.enabled = true;
      this.onScroll();
    },

    off: function() {
      this.stopFloat();
      this.enabled = false;
    }
  });

})(window.jQuery || window.Zepto);
