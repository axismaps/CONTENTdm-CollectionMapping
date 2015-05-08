function lightboxEntry( $entry, data ){
	var $div = startLightbox( $entry, data, loadFullImage );
	var pdf = ( data.filetype == "pdf" && AppVars.pdfCapable );
	if ( pdf ){
		ligthtboxPDF( $div, data.pointer )
			.insertAfter( $("img",$div) );
		$( "img", $div ).remove();
		$( ".mask", $div ).remove();
	} else {
		$( ".mask", $div ).animate({
			top: 20,
			left: 20,
			height: 270
		});
	}
	$( ".entry-title", $div ).prependTo( $(".text-container", $div) );
	function loadFullImage(){
		if ( pdf ) return;
		else if ( data.filetype == "pdf" ){
			$( "<a>" )
				.attr( "href", "http://cdm15963.contentdm.oclc.org/utils/getfile/collection/" + AppVars.collectionAlias + "/id/" + data.pointer + "/filename/" + data.pointer + ".pdf" )
				.attr( "target", "_blank" )
				.attr( "class", "pdf" )
				.html( "Download PDF document" )
				.insertAfter( $( ".entry-title", $div ) );
		}
		var $image = $( "img", $div );
		var $loader = $( "<div>" )
			.attr( "class", "image-loader" )
			.css({
				width: $image.parent().width(),
				height: $image.parent().height()
			})
			.append( '<i class="fa fa-spinner fa-spin"></i>' )
			.append( '<p>Loading full image...</p>' )
			.appendTo( $( ".image-container", $div ) );
		var src = $image.attr( "src" );
		src = src.replace( "small", "full" )
		$image.attr( "src", src )
			.load( function(){
				$( ".mask", $div ).remove();
				var size = onFullImageLoad( $(this), $div );
			})
	}
}

function lightboxReport( $report, data ){
	var $div = startLightbox( $report, data, loadFullImage );
	var button = $( ".button", $div )
		.prependTo($("p.accordion-text", $div) )
		.click( function(){
			// TO DO: load report
		});
	
	var pdf = ( data.filetype == "pdf" && AppVars.pdfCapable );
	if ( pdf ){
		ligthtboxPDF( $div, data.pointer )
			.appendTo( $(".accordion-image",$div) );
		title.addClass("loaded").insertAfter( button );
		$( ".image-container", $div ).css( "background-image", "none" );
	}

	function loadFullImage(){
		if ( pdf ) return;
		else if ( data.filetype == "pdf" ){
			$( "<a>" )
				.attr( "href", "http://cdm15963.contentdm.oclc.org/utils/getfile/collection/" + AppVars.collectionAlias + "/id/" + data.pointer + "/filename/" + data.pointer + ".pdf" )
				.attr( "target", "_blank" )
				.attr( "class", "pdf" )
				.html( "Download PDF document" )
				.insertAfter( title );
		}
		var $imageDiv = $( ".accordion-image", $div );
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
		src = src.replace( "small", "full" )
		$image.attr( "src", src )
			.load( function(){
				onFullImageLoad( $(this), $div );
			});
		$imageDiv.css( "background-image", "none" );
		$title = $( '<h3 class="entry-title" />' ).text( data.Title ).appendTo( $imageDiv );
	}
}

function startLightbox( $content, data, callback ){
	var mask = $( "<div class='lightbox-mask lightbox'>" )
		.appendTo( "body" )
		.click( function(){
			$( ".lightbox" ).remove();
		});
	var w, h;
	var pdf = ( data.filetype == "pdf" && AppVars.pdfCapable );
	if ( pdf ){
		w = .8 * $(window).width();
		h = .8 * $(window).height();
	} else {
		w = 600;
		h = $( ".image-container", $div ).height();
	}
	var $div = $content.clone()
		.removeAttr("class")
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
	$div.find( 'p.accordion-text' ).text( '' ).append( '<span>' + data.Description + '</span>' );
	$( ".image-expand", $div ).remove();
	return $div;
}

function ligthtboxPDF( $div, pointer ){
	var w = .8 * $(window).width(),
		h = .8 * $(window).height();
	var url = "http://cdm15963.contentdm.oclc.org/utils/getfile/collection/" + AppVars.collectionAlias + "/id/" + pointer + "/filename/" + pointer + ".pdf";
	var obj = $( "<object>" )
		.attr( "data", url )
		.attr( "type", "application/pdf" )
		.attr( "width", w - 400 )
		.attr( "height", h )
		.html( "alt : <a href='" + url + "'>Download PDF</a>" );
	$( ".image-container", $div ).css({
		"width": w - 400,
		"height": h,
		"overflow": "hidden"
	});
	$( ".text-container", $div ).css( "max-height", h );
	return obj;
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