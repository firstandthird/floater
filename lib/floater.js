Fidel.Floater = Fidel.ViewController.extend({
  defaults: {
    topPadding: 10,
    stopPoint: -1
  },
  init: function() {
    $(window).scroll(this.proxy(this.onScroll));

    console.log(this.el.offset().top);
    this._top = this.el.offset().top;
    this._floating = false;
  },
  startFloat: function() {
    var self = this;
    this._floating = true;
    this.el.css({
      position: 'fixed',
      top: self.topPadding 
    });
  },
  stopFloat: function(posY) {
    var self = this;
    this._floating = false;
    this.el.css({
      position: 'absolute',
      top: posY 
    });
  },
  onScroll: function(e) {
    var scrollY = $(window).scrollTop();
    if (scrollY > this._top) {
      if (this.stopPoint != -1 && scrollY > this.stopPoint) {
        this.stopFloat(this.el.offset().top);
      } else if (!this._floating) {
        this.startFloat();
      }
    } else if (scrollY < this._top && this._floating) {
      this.stopFloat(this._top);
    }
  }
});
