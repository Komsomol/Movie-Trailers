var container, computedwidth, width, holderWidth;

app = {
	init:function(){
		console.log('hello world');
		app.bindEvents();
		app.getWidth();
	},

	getWidth:function(){
		container = document.querySelector('.flex-container');
		computedwidth = window.getComputedStyle(container).width;
		width = parseInt((computedwidth).replace('px'), 10);

		holderWidth = Math.floor(width * 9 / 16);

		console.log(holderWidth);

		var holders = document.querySelectorAll('.holder');

		for (var i = 0; i < holders.length; i++) {
			holders[i].style.width = holderWidth + 'px';
		}


	},

	bindEvents:function(){
		window.addEventListener("resize", app.getWidth);
	},
};

app.init();