/*!
  * Floater - a jQuery library to float an element 
  * v0.0.4
  * https://github.com/jgallen23/floater
  * copyright JGA 2012
  * MIT License
  */

(function($) {
  var Floater = function(element, options) {
    this.init(element, options);
  };

  Floater.prototype = {
    init: function(element, options) {
      this.el = $(element);
      this.opts = $.extend({}, $.fn.floater.defaults, options);
      var offset = this.el.offset();
      this.originX = offset.left;
      this.originY = offset.top;
      this.originTop = this.el.css('top');
      this.height = this.el.height();

      this.opts.startPoint = this.opts.startPoint == -1 ? this.originY : this.opts.startPoint;

      this.floating = false;
      $(window).scroll($.proxy(this.onScroll, this));
    },
    startPoint: function(point) {
      this.opts.startPoint = point;
    },
    stopPoint: function(point) {
      this.opts.stopPoint = point;
    },
    startFloat: function() {
      this.floating = true;
      this.el.css({
        position: 'fixed',
        top: this.opts.topPadding,
        left: this.originX + this.opts.offsetX
      });
    },
    stopFloat: function(posY) {
      this.floating = false;
      this.el.css({
        position: 'absolute',
        top: posY,
        left: 'auto'
      });
    },
    onScroll: function(e) {
      var scrollY = $(window).scrollTop();
      if (scrollY > this.opts.startPoint) {
        if (this.opts.stopPoint != -1 && (scrollY + this.height) > this.opts.stopPoint) {
          if (this.floating) {
            this.stopFloat(this.opts.stopPoint - this.height);
          }
        } else if (!this.floating) {
          this.startFloat();
        }
      } else if (this.floating && scrollY < this.opts.startPoint) { //top of screen
        this.stopFloat(this.originTop);
      }
    }
  };

  $.fn.floater = function(option, arg) {
    this.each(function(i, item) {
      var $this = $(this);
      var data = $this.data('floater');
      var options = typeof option == 'object' && option;
      if (!data) {
        data = new Floater(this, options);
        $this.data('floater', data);
      }
      if (typeof option == 'string') {
        data[option](arg);
      }
    });
  };
  $.fn.floater.defaults = {
    topPadding: 10,
    stopPoint: -1,
    startPoint: -1,
    relative: false,
    offsetX: 0,
    offsetY: 0
  };

})(window.jQuery || window.Zepto);
