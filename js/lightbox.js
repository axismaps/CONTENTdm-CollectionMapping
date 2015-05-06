function lightboxEntry( $entry, data ){
	var $div = startLightbox( $entry, data, loadFullImage );
	
	$( ".entry-title, .mask", $div ).animate({
		top: 20,
		left: 20
	});
	$( ".image-container", $div ).css( "overflow", "hidden" );
	if ( data.filetype == "pdf" ){
		var w = .9 * $(window).width(),
			h = .9 * $(window).height();
		$( "<object>" )
			.attr( "data", "http://cdm15963.contentdm.oclc.org/utils/getfile/collection/" + AppVars.collectionAlias + "/id/" + data.pointer + "/filename/" + data.pointer + ".pdf" )
			.attr( "type", "application/pdf" )
			.attr( "width", w - 400 )
			.attr( "height", h )
			.css( "width", w - 400 )
			.css( "height", h )
			.insertAfter( $("img",$div) );
		$( ".image-container", $div ).css({
			"width": w - 400,
			"height": h,
			"overflow": "hidden"
		});
		$( ".mask", $div ).remove();
		$( "img", $div ).remove();
		$( ".entry-title", $div ).prependTo( $(".text-container", $div) );
		$( ".text-container", $div ).css( "max-height", h );
	}
	function loadFullImage(){
		var $image = $( "img", $div );

		if ( data.filetype == "pdf" ){
			

		} else {
			var $loader = $( "<div>" )
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
					$( ".mask", $div ).remove();
					$( ".entry-title", $div ).prependTo( $(".text-container"), $div );
				})
		}
	}
}

function lightboxReport( $report, data ){
	var $div = startLightbox( $report, data, loadFullImage );
	var title = $report.prev().clone().removeAttr("class").appendTo( $div );
	var button = $( ".button", $div )
		.prependTo($(".text-container", $div) )
		.click( function(){
			// TO DO: load report
		});
	if ( data.filetype == "pdf" ){
		var w = .9 * $(window).width(),
			h = .9 * $(window).height();
		$( "<object>" )
			.attr( "data", "http://cdm15963.contentdm.oclc.org/utils/getfile/collection/" + AppVars.collectionAlias + "/id/" + data.pointer + "/filename/" + data.pointer + ".pdf" )
			.attr( "type", "application/pdf" )
			.attr( "width", w - 400 )
			.attr( "height", h )
			.css( "width", w - 400 )
			.css( "height", h )
			.appendTo( $(".image-container", $div) );
		$( ".image-container", $div ).css({
			"width": w - 400,
			"height": h,
			"overflow": "hidden"
		});
		//$( ".mask", $div ).remove();
		$( "img", $div ).remove();
		title.addClass("loaded").insertAfter( button );
		$( ".text-container", $div ).css( "max-height", h );
	}
	function loadFullImage(){
		console.log(data.filetype)
		if ( data.filetype == "pdf" ) return;
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

function startLightbox( $content, data, callback ){
	var mask = $( "<div class='lightbox-mask lightbox'>" )
		.appendTo( "body" )
		.click( function(){
			$( ".lightbox" ).remove();
		});
	var w, h;
	if ( data.filetype == "pdf" ){
		w = .9 * $(window).width();
		h = .9 * $(window).height();
	} else {
		w = 600;
		h = $( ".image-container", $div ).height();
	}
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
			"margin-left": -w/2 -20,
			"margin-top": -h/2 - 20,
			width: w,
			height: h,
			padding: 20
		},callback);
	$( ".text-container", $div ).css( {
		"margin-left": w/2 + 10,
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
	var w = Math.min( image.width(), .9 * $(window).width() - 400 ),
		h;
	if ( w * image.height() / image.width() > .9 * $(window).height() ){
		h = Math.min( image.height(), .9 * $(window).height() );
		w = h * image.width() / image.height();
	} else {
		h = w * image.height() / image.width();
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