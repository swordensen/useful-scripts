function loadImages() {
	// images
	$('img, picture > source').each(function () {
	
		var img = $(this),
		imgSrc = $(this).data('src') || $(this).attr('src'),
		imgSrcset = $(this).data('srcset');
		
		(imgSrc !== 'undefined') && $(this).attr('src', imgSrc);
		(imgSrcset !== 'undefined') && $(this).attr('srcset', imgSrcset);
		
		if($(this).hasClass('svg')){
			var imgID = img.attr('id');
			var imgClass = img.attr('class');
			$.get(imgSrc, function(data) {
				var svg = $(data).find('svg');
				if (typeof imgID !== 'undefined') {
					svg = svg.attr('id', imgID);
				}
				if (typeof imgClass !== 'undefined') {
					svg = svg.attr('class', imgClass + ' replaced-svg');
				}
				svg = svg.removeAttr('xmlns:a');
				img.replaceWith(svg);
			}, 'xml');
		}
	});
	
	// background images
	$('div, section').each(function () {
		if ($(this).attr('data-src')) {
			var backgroundImg = $(this).data('src');
			$(this).css('background-image', 'url(' + backgroundImg + ')');
		}
	});

	console.log('images loaded');
	//css images
	$('html').addClass('lazy-loaded');
}

loadImages();