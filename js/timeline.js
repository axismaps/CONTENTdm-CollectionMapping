function drawTimeline(){
	DataVars.filteredData.entries = _.sortBy( DataVars.filteredData.entries, function(d){
		return parseInt(d.date.year || 0)*1000 + parseInt(d.date.month || 0)*10 + parseInt(d.date.day || 0);
	});
	var allYears = _.map( DataVars.filteredData.entries, function(d){ return d.date.year } );

	AppVars.years = _.uniq( _.reject( allYears, function(d){ return !d } ) );

	$("#timeline-inner").empty();
	for( var i in AppVars.years ){
		drawYear( AppVars.years[i] );
	}

	drawPulse();
	selectYear( AppVars.years[0] );

	$( ".entry-title" ).click( function(){
		var $entry = $(this).parent().parent(),
			$year = $entry.parent();
		if ( !$year.hasClass( "active" ) || $entry.hasClass( "expanded" ) ) return;
		$( ".timeline-entry.expanded", $entry.parent() )
			.removeClass( "expanded" )
			.scrollTop( 0 )
			.removeAttr( "style" );
		expandEntry( $entry );
	});
}

function expandEntry( $entry ){
	var totalHeight = $("#timeline-inner").height();
	$entry.addClass( "expanded" )
		.css( "height", Math.max( 500, totalHeight - $entry.siblings().length * 51 )  + "px");
}

function drawYear( year ){
	var $div = $( "<div>" )
		.attr( "class", "timeline-year" )
		.attr( "id", "year" + year )
		.appendTo( "#timeline-inner" )
		.click( function(){
			if ( !$(this).hasClass( "active" ) ) selectYear( year );
		})

	var entries = _.filter( DataVars.filteredData.entries, function(d){
		return d.date.year == year;
	});
	_.each( entries, function(d,i){
		var $entry = $( "<div class='timeline-entry e" + i + "'>" );
		var $imageContainer = $( "<div class='image-container'>" )
			.appendTo( $entry );
		$( "<img>" )
			.attr( "data-src", "http://cdm15963.contentdm.oclc.org/utils/ajaxhelper/?CISOROOT=" + AppVars.collectionAlias + "&CISOPTR=" + d.pointer +"&action=2&DMSCALE=20&DMWIDTH=400&DMHEIGHT=270" )	// fake image source for testing, obvs
			.appendTo( $imageContainer );
		$( "<div class='mask'>" ).appendTo( $imageContainer );

		var title = $( "<p>" ).attr( "class", "entry-title" );
		if ( d.date.day )
			title.html( d.date.month + "/" + d.date.day + "/" + year + " | " + d.title )
		else
			title.html( year + " | " + d.title );
		$imageContainer.append( title );

		var $textContainer = $( "<div class='text-container'>" )
			.append( "<p class='entry-description'>" + d.descri + "</p>" )
			.append( "<p><strong>SUBJECT:</strong> " + getSubjectLinks(d.subjec) + "</p>" )
			.appendTo( $entry );

		$( '<div class="image-expand"><i class="fa fa-expand fa-2x"></i></div>' )
			.appendTo( $imageContainer )
			.on( 'click', function(){
				lightboxEntry( $entry );
			});

		$div.append( $entry );
	});
	expandEntry( $(".timeline-entry.e0", $div) );
}

function selectYear( year, noAutoScroll, noImages ){
	if ( year == undefined || !$( "#year" + year).length ) return;
	AppVars.selectedYearIndex = AppVars.years.indexOf( year );
	$( ".timeline-year.active" ).removeClass( "active" );
	$( ".pulse-circle.active" ).removeClass( "active" );
	$( "#year" + year).addClass( "active" );
	$( ".p" + year).addClass( "active" );
	$( "#year" ).html( year );

	AppVars.selectedYear = year;
	if ( !noAutoScroll ) recenterTimeline();

	if ( noImages ) return;
	loadTimelineImages( year );	// load selected year images before surrounding years
}

function advanceTimeline(){
	if ( AppVars.selectedYear == undefined ) return;
	selectYear( AppVars.years[ AppVars.selectedYearIndex + 1 ] );
}

function rewindTimeline(){
	if ( AppVars.selectedYear == undefined ) return;
	selectYear( AppVars.years[ AppVars.selectedYearIndex - 1 ] );
}

function recenterTimeline(){
	if ( !$( ".timeline-year.active" ).length ) return;
	var left = $( ".timeline-year.active" ).index() * $( ".timeline-year" ).outerWidth()
			- ( $( "#timeline" ).width()  - $( ".timeline-year" ).outerWidth() ) / 2;
	$( "#timeline-inner" ).off( "scroll" )
		.animate( { scrollLeft: left }, function(){
			$( "#timeline-inner" ).on( "scroll", timelineScroll );
		});
	AppVars.timelineRecenterFlag = false;
}

function timelineScroll(){
	var left = $( this ).scrollLeft() + $("#timeline").width() / 2,
		index = parseInt( left / 400 );
	var year;
	if ( left == 0 ) year = AppVars.years[0];
	else if ( Math.abs( left - (AppVars.years.length - $( this ).parent().width()) ) < 10 ) year = AppVars.years[ AppVars.years.length - 1 ];
	else year = AppVars.years[ index ];
	clearTimeout( AppVars.scrollTimeout );
	AppVars.scrollTimeout = setTimeout( timelineScrollStop, 100 );
	if ( year != AppVars.selectedYear ){
		selectYear( year, true, true );
		AppVars.timelineRecenterFlag = true;
	}
}
function timelineScrollStop(){
	if ( !AppVars.timelineRecenterFlag ) return;
	loadTimelineImages( AppVars.selectedYear );
	recenterTimeline();
}

function loadTimelineImages(year){
	year = year || AppVars.selectedYear;
	if ( year == undefined || !$( "#year" + year).length ) return;
	var index = AppVars.years.indexOf( year );
	for ( var i = index - 2; i <= index + 2; i++ ){
		var y = AppVars.years[i];
		$( ".timeline-entry img", $( "#year" + y) ).each( function(){
			if (typeof $(this).attr("src") !== typeof undefined && $(this).attr("src") !== false) {
				return;
			}
			$(this).attr( "src", $(this).attr("data-src") );
		});
	}	
}
function getSubjectLinks( subject ){
	var subjects = subject.replace(/; /g,";").split(";");
	subjects.forEach( function(s){
		subject = subject.replace( s, "<a href='#'>" + s + "</a>" );	// TO DO: make link actually do something
	});
	return subject;
}
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
			})
	}
}