function lightboxEntry( $entry ){
	var $div = startLightbox( $entry, loadFullImage );
	$( ".entry-title, .mask", $div ).animate({
		top: 20,
		left: 20
	});
	function loadFullImage(){
		var $image = $( "img", $div );
		$( "<div>" )
			.attr( "class", "image-loader" )
			.css({
				width: $image.width(),
				height: $image.height()
			})
			.append( '<i class="fa fa-spinner fa-spin"></i>' )
			.append( '<p>Loading full image...</p>' )
			.insertAfter( $image );
		var src = $image.attr( "src" );
		src = src.replace( "=400", "=6000" )
			.replace( "=270", "=6000" )
			.replace( "=20", "=100" );
		$image.attr( "src", src )
			.load( function(){
				var size = onFullImageLoad( $(this), $div );
				$( ".mask", $div ).animate({
					width: size.width
				});
			})
	}
}

function lightboxReport( $report ){
	var $div = startLightbox( $report, loadFullImage );
	function loadFullImage(){
		var $imageDiv = $( ".image-container", $div );
		var $image = $( "<img>" )
			.css({
				height: $imageDiv.height(),
				visibility: "hidden"
			})
			.appendTo( $imageDiv );
		$( "<div>" )
			.attr( "class", "image-loader" )
			.css({
				width: $imageDiv.width(),
				height: $imageDiv.height()
			})
			.append( '<i class="fa fa-spinner fa-spin"></i>' )
			.append( '<p>Loading full image...</p>' )
			.appendTo( $imageDiv );
		var src = $imageDiv.css( "background" ).match(/url\((.*)\)/)[1];
		src = src.replace( "=1000", "=6000" )
			.replace( "=800", "=6000" )
			.replace( "=20", "=100" );
		$image.attr( "src", src )
			.load( function(){
				onFullImageLoad( $(this), $div );
			});
	}
}

function startLightbox( $content, callback ){
	var mask = $( "<div class='lightbox-mask lightbox'>" )
		.appendTo( "body" )
		.click( function(){
			$( ".lightbox" ).remove();
		});
	var $div = $content.clone()
		.removeClass( "ui-accordion" )
		.removeClass( "ui-accordion-content" )
		.addClass( "lightbox" )
		.css({
			position: "absolute",
			left: $content.offset().left,
			top: $content.offset().top,
			"margin-top": 0,
			"margin-left": 0,
			width: 300,
			height: $content.height(),
			transition: "none",
			padding: 0
		})
		.appendTo("body")
		.animate({
			left: "50%",
			top: "50%",
			"margin-left": -300,
			"margin-top": -135,
			width: 600,
			height: $( ".image-container", $div ).height(),
			padding: 20
		},callback);
	$( ".text-container", $div ).css( {
		"margin-left": 310,
		"margin-top": 0 
	});		
	$( ".image-expand", $div ).remove();
	return $div;
}

function onFullImageLoad( image, container ){
	$( ".image-loader", container ).remove();
	image.css({
			"height": "auto",
			"visibility": "visible"
		});
	var	w,
		h;
	image.parent().css({
		"width": "auto",
		"height": "auto",
		"overflow": "hidden"
	});
	if ( image.width()> image.height() ){
		w = Math.min( image.width(), .9 * $(window).width() - 400 );
		h = w * image.height() / image.width();
	} else {
		h = Math.min( image.height(), .9 * $(window).height() );
		w = h * image.width() / image.height();
	}
	image.css("height",300).animate( {width:w,height:h} );
	$( ".text-container", container ).animate( {
		"margin-left": w + 10
	});
	container.animate({
		height: h,
		width: w + 400,
		"margin-top": -h/2 - 20,
		"margin-left": -(w+400)/2 - 20
	});
	$( ".text-container", container ).css( "max-height", h );
	return { width: w, height: h };
}