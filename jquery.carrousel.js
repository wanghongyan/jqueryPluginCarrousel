;(function ($) {
	//定义Carrousel的构造函数
	function Carrousel (ele, options) {
		this.$ele = $(ele);
		this.timerId = 0;
		this.isScrolling = false;
		this.isMouseDown = false;
		this.sx = 0;
		this.sy = 0;
		this.defaults = {
			current: 0,
			count: 4,
			width: '300px',
			autoScroll: true,
			interval: 2000
		};
		this.options = $.extend({}, this.defaults, options);

		var	carrouselWrapper = this.$ele;
		carrouselWrapper.css({
			'width': this.options.width,
			'height': this.options.height
		});

	};
	//定义Carrousel的方法
	Carrousel.prototype.prev = function() {
		var _self = this;
		var index = _self.options.current;
		var next = index -1;

		if (next == -1) {
			_self.$ele.find('.carrousel-list').css({'left': -parseInt(_self.options.width, 10) * (_self.options.count) + 'px'});
			next = _self.options.count - 1;
		}

		_self.moveTo(next);
	};
	Carrousel.prototype.forward = function() {
		var _self = this;
		var index = _self.options.current;
		var next = index + 1;

		_self.moveTo(next);
	};
	Carrousel.prototype.moveTo = function(index) {
		var _self = this;
		if (!_self.isScrolling) {
			var movePos = parseInt(_self.options.width) * index;
			var toolbar = _self.$ele.find('.carrousel-toolbar li');

			_self.isScrolling = true;
			_self.$ele.find('.carrousel-list').animate({left: -movePos+'px'}, function() {
				if (index == _self.options.count) {
					_self.$ele.find('.carrousel-list').css({'left': 0});
					index = 0;
				}

				_self.options.current = index;

				toolbar.each(function(idx, ele) {
					if (idx == index) {
						$(ele).addClass('carrousel-toolbar-current');
					} else {
						$(ele).removeClass('carrousel-toolbar-current');
					}
				});

				_self.isScrolling = false;

			});
		}
	};
	Carrousel.prototype.startTimer = function() {
		var _self = this;
		_self.timerId = setInterval(function() {
			_self.forward();
		}, _self.options.interval);
	};
	Carrousel.prototype.stopTimer = function() {
		var _self = this;
		clearInterval(_self.timerId);
	};
	$.fn.Carrousel = function (options) {		
		return this.each(function(index, ele) {
			var carrousel = new Carrousel(ele, options);
			var	carrouselWrapper = carrousel.$ele;
			var	prev = carrouselWrapper.find('.carrousel-control-prev');
			var	forward = carrouselWrapper.find('.carrousel-control-forward');
			var toolbar = carrouselWrapper.find('.carrousel-toolbar li');

			prev.bind('click', function() {
				carrousel.prev();
			});
			forward.bind('click', function() {
				carrousel.forward();
			});

			toolbar.each(function(index, ele) {
				$(ele).bind('click', function() {
					carrousel.moveTo(index);
				});
			});

			carrouselWrapper.hover(function() {
				carrousel.stopTimer();
			}, function() {
				carrousel.startTimer();
			});

			carrouselWrapper.mousedown(function(event) {
				// $.log('mouse down -----');
				// $.log(event);
				carrousel.isMouseDown = true;
				carrousel.sx = event.clientX;
				carrousel.sy = event.clientY;
			});
			carrouselWrapper.mousemove(function(event) {
					event.preventDefault();
				if (carrousel.isMouseDown) {
					if (event.buttons == 1) {
						// $.log('mouse move -----');
						// $.log(event);

						var offsetX = event.clientX - carrousel.sx;
						$.log(offsetX);
						// carrousel.$ele.find('.carrousel-list').css({'left': -(parseInt(carrousel.options.width, 10) * (carrousel.options.current) + offsetX) + 'px'});
			
					}
					else {
						carrousel.isMouseDown = false;
					}
				}
			});

			if (carrousel.options.autoScroll) {
				carrousel.startTimer();
			}
			
		});
	}
})(jQuery);