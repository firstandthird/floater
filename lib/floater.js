(function($) {
  $.declare('floater', {
    defaults: {
      topPadding: 0,
      stopPoint: -1,
      startPoint: -1,
      relative: false,
      offsetX: 0,
      offsetY: 0
    },
    init: function() {
      var offset = this.el.offset();
      this.originX = offset.left;
      this.originY = offset.top;
      this.width = this.el.width();
      this.height = this.el.height();
      this.resetStyles = {
        position: this.el.css('position'),
        top: this.el.css('top'),
        left: this.el.css('left'),
        width: this.el.css('width')
      };

      this.startPoint = this.startPoint == -1 ? this.originY : this.startPoint;

      this.floating = false;
      $(window).scroll(this.proxy(this.onScroll));
    },
    setStartPoint: function(point) {
      this.startPoint = point;
    },
    setStopPoint: function(point) {
      this.stopPoint = point;
    },
    createPlaceholder: function() {
      return $('<div/>').addClass('floater-placeholder').css($.extend({}, this.resetStyles, { width: this.width, height: this.height }));
    },
    startFloat: function() {
      if (this.floating) {
        return;
      }
      this.floating = true;
      this.el.before(this.createPlaceholder());
      this.el.css({
        position: 'fixed',
        top: this.topPadding,
        left: this.originX + this.offsetX,
        width: this.width
      });
      this.emit('floatStart');
    },
    stopFloat: function(posY) {
      if (!this.floating) {
        return;
      }
      this.floating = false;
      this.el.prev().remove();
      this.el.css(this.resetStyles);
      this.emit('floatStop');
    },
    onScroll: function(e) {
      var scrollY = $(window).scrollTop();
      if (scrollY > this.startPoint) {
        if (this.stopPoint != -1 && (scrollY + this.height) > this.stopPoint) {
          if (this.floating) {
            this.stopFloat(this.stopPoint - this.height);
          }
        } else if (!this.floating) {
          this.startFloat();
        }
      } else if (this.floating && scrollY < this.startPoint) { //top of screen
        this.stopFloat(this.resetStyles.top);
      }
    }
  });

})(window.jQuery || window.Zepto);
