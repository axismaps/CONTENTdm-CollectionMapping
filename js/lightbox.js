function lightboxEntry( $entry ){
	var mask = $( "<div class='lightbox-mask lightbox'>" )
		.appendTo( "body" )
		.click( function(){
			$( ".lightbox" ).remove();
		});
	var $div = $entry.clone()
		.addClass( "lightbox" )
		.css({
			position: "absolute",
			left: $entry.offset().left,
			top: $entry.offset().top,
			"margin-top": 0,
			"margin-left": 0,
			width: 400,
			height: $entry.height(),
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
			height: 270,
			padding: 20
		},loadFullImage);
	$( ".text-container", $div ).css( {
		"margin-left": 410,
		"margin-top": 0 
	});		
	$( ".entry-title, .mask", $div ).animate({
		top: 20,
		left: 20
	});
	$( ".image-expand", $div ).remove();
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
				$( ".image-loader", $div ).remove();
				var $this = $(this).css( "height", "auto" ),
					w,
					h;
				$this.parent().css("width","auto");
				if ( $this.width()> $this.height() ){
					w = Math.min( $this.width(), .9 * $(window).width() - 400 );
					h = w * $this.height() / $this.width();
				} else {
					h = Math.min( $this.height(), .9 * $(window).height() );
					w = h * $this.width() / $this.height();
				}
				$this.css("height",270).animate( {width:w,height:h} );
				$( ".text-container", $div ).animate( {
					"margin-left": w + 10
				});
				$( ".mask", $div ).animate({
					width: w
				})
				$div.animate({
					height: h,
					width: w + 400,
					"margin-top": -h/2 - 20,
					"margin-left": -(w+400)/2 - 20
				});
				$( ".text-container", $div ).css( "max-height", h );
			})
	}
}

function lightboxReport( $report ){
	var mask = $( "<div class='lightbox-mask lightbox'>" )
		.appendTo( "body" )
		.click( function(){
			$( ".lightbox" ).remove();
		});
	var $div = $report.clone()
		.removeClass( "ui-accordion" )
		.removeClass( "ui-accordion-content" )
		.addClass( "lightbox" )
		.css({
			position: "absolute",
			left: $report.offset().left,
			top: $report.offset().top,
			"margin-top": 0,
			"margin-left": 0,
			width: 300,
			height: $report.height(),
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
			height: 300,
			padding: 20
		},loadFullImage);
	$( ".text-container", $div ).css( {
		"margin-left": 310,
		"margin-top": 0 
	});		
	// $( ".entry-title, .mask", $div ).animate({
	// 	top: 20,
	// 	left: 20
	// });
	$( ".image-expand", $div ).remove();
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
				$( ".image-loader", $div ).remove();
				var $this = $(this).css( {
						"height": "auto",
						"visibility": "visible"
					}),
					w,
					h;
				$this.parent().css({
					"width": "auto",
					"height": "auto",
					"overflow": "hidden"
				});
				if ( $this.width()> $this.height() ){
					w = Math.min( $this.width(), .9 * $(window).width() - 400 );
					h = w * $this.height() / $this.width();
				} else {
					h = Math.min( $this.height(), .9 * $(window).height() );
					w = h * $this.width() / $this.height();
				}
				$this.css("height",300).animate( {width:w,height:h} );
				$( ".text-container", $div ).animate( {
					"margin-left": w + 10
				});
				$div.animate({
					height: h,
					width: w + 400,
					"margin-top": -h/2 - 20,
					"margin-left": -(w+400)/2 - 20
				});
				$( ".text-container", $div ).css( "max-height", h );
			})
	}
}