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
      this.enabled = true;
      this.originX = offset.left;
      this.originY = offset.top;
      this.height = this.el.outerHeight(true);
      this.resetStyles = {
        position: this.el.css('position'),
        top: this.el.css('top'),
        left: this.el.css('left'),
        width: this.el.css('width')
      };

      this.startPoint = this.startPoint == -1 ? (this.originY - parseInt(this.topPadding, 10)) : this.startPoint;

      this.floating = false;
      $(window).on('scroll', this.proxy(this.onScroll));
      this.onScroll();
    },

    setStartPoint: function(point) {
      this.startPoint = point;
    },

    setStopPoint: function(point) {
      this.stopPoint = point;
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
      this.el.before(this.createPlaceholder());
      this.el.css({
        position: 'fixed',
        top: this.topPadding,
        left: this.originX + this.offsetX,
        width: this.el.css('width')
      });
      this.emit('floatStart');
    },

    stopFloat: function(posY) {
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

    onScroll: function(e) {
      if (!this.enabled) {
        return;
      }
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
