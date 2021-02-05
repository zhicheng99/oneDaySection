function Drag(options) {
  this.drag = null;
  this.disX = 0;
  this.disY = 0;
  this.options = {
    dragRangeDom: options.dragRangeDom,
    dragAimClass: options.dragAimClass ? options.dragAimClass : "",
    dragServerClass: options.dragServerClass ? options.dragServerClass : "",
    moveFun: options.moveFun ? options.moveFun : function () {},
    upFun: options.upFun ? options.upFun : function () {},
    downFun: options.downFun ? options.downFun : function () {},
    range: []
  };

  this.init();
}
Drag.prototype.addEvents = function (target, eventType, handle) {
  if (target.addEventListener) {
    target.addEventListener(eventType, handle, false);
  } else {
    target.attachEvent("on" + eventType, function () {
      handle.call(target, arguments);
    });
  }
};

Drag.prototype.removeEvents = function (target, eventType, handle) {
  if (target.removeEventListener) {
    target.removeEventListener(eventType, handle, false);
  } else if (target.detachEvent) {
    target.detachEvent("on" + eventType, handle);
  } else {
    target["on" + eventType] = null;
  }
};
Drag.prototype.createRange = function () {
  // console.log(this.options.dragRangeDom.offsetWidth);
  this.options.range = [0, this.options.dragRangeDom.offsetWidth];
};
Drag.prototype.init = function () {
  this.createRange();
  this.mouseMove();
};

Drag.prototype.getElementLeft = function (element) {
  var actualLeft = element.offsetLeft;
  var current = element.offsetParent;

  while (current !== null) {
    actualLeft += current.offsetLeft;
    current = current.offsetParent;
  }

  return actualLeft;
};
Drag.prototype.getElementTop = function (element) {
  var actualTop = element.offsetTop;
  var current = element.offsetParent;

  while (current !== null) {
    actualTop += current.offsetTop;
    current = current.offsetParent;
  }

  return actualTop;
};

Drag.prototype.mouseMove = function () {
  var _this = this;

  this.addEvents(document, "mouseleave", function (event) {
    _this.disX = 0;
    _this.disY = 0;
    _this.drag = null;
  });

  this.addEvents(document, "mouseup", function (event) {
    _this.disX = 0;
    _this.disY = 0;
    _this.options.upFun();
    _this.drag = null;
  });

  this.addEvents(document, "mousedown", function (event) {
    var e = event || window.event;

    //点中了要拖动的元素
    if (e.target.className === _this.options.dragAimClass) {
      _this.drag = e.target;

      _this.options.downFun();

      var scrollX =
        document.documentElement.scrollLeft || document.body.scrollLeft;
      var scrollY =
        document.documentElement.scrollTop || document.body.scrollTop;
      var x = e.pageX || e.clientX + scrollX;
      var y = e.pageY || e.clientY + scrollY;

      _this.disX = x - e.target.offsetLeft;
      // _this.disY = y - e.target.offsetTop;
    }
  });

  this.addEvents(document, "mousemove", function (event) {
    if (_this.drag !== null) {
      var e = event || window.event;
      var scrollX =
        document.documentElement.scrollLeft || document.body.scrollLeft;
      var scrollY =
        document.documentElement.scrollTop || document.body.scrollTop;
      var x = e.pageX || e.clientX + scrollX;
      var y = e.pageY || e.clientY + scrollY;

      // var layX = document.getElementById('qflow_lay').offsetLeft;
      // var layY = document.getElementById('qflow_lay').offsetTop;
      var new_x =
        x - _this.disX - scrollX <= _this.options.range[0]
          ? _this.options.range[0]
          : x - _this.disX - scrollX;
      new_x = new_x >= _this.options.range[1] ? _this.options.range[1] : new_x;
      _this.drag.style.left = new_x + "px";
      //   _this.drag.style.top = y - _this.disY - scrollY + "px";

      _this.options.moveFun(new_x, y);
    }
  });
};

export { Drag };
