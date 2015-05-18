function drawTimeline(){
	DataVars.filteredData.entries = _.sortBy( DataVars.filteredData.entries, function(d){
		return parseInt(d.date.year || 0)*1000 + parseInt(d.date.month || 0)*10 + parseInt(d.date.day || 0);
	});
	var allYears = _.map( DataVars.filteredData.entries, function(d){ return d.date.year } );

	AppVars.years = _.uniq( _.reject( allYears, function(d){ return !d } ) );
	
	$("#timeline-inner").empty();
	var closestYear = 0,
		goalYear = AppVars.selectedYear;
	for( var i in AppVars.years ){
		drawYear( AppVars.years[i] );
		
		if( AppVars.years[i] == goalYear ) {
			closestYear = goalYear;
		} else if( Math.abs( goalYear - AppVars.years[i] ) < Math.abs( goalYear - closestYear ) ) {
			closestYear = AppVars.years[i];
		}
	}
	selectYear( closestYear );

	drawPulse();
	drawChronology();

	$( ".entry-title" ).click( function(){
		var $entry = $(this).parent().parent(),
			$year = $entry.parent();
		selectPoint( $entry.attr( 'id' ).replace( 'entry', '' ) );
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
		.css( "height", Math.max( 400, totalHeight - $entry.siblings().length * 51 )  + "px");
}

function drawYear( year ){
	var $div = $( "<div>" )
		.attr( "class", "timeline-year" )
		.attr( "id", "year" + year )
		.addClass( 'hide-year' )
		.appendTo( "#timeline-inner" )
		.click( function(){
			if ( !$(this).hasClass( "active" ) ) selectYear( year );
		})

	var entries = _.filter( DataVars.filteredData.entries, function(d){
		return d.date.year == year;
	});
	_.each( entries, function(d,i){
		var $entry = $( "<div class='timeline-entry e" + i + " db-entry' id='entry" + d.pointer + "'>" );
		var $imageContainer = $( "<div class='image-container'>" )
			.appendTo( $entry );
		$( "<img>" )
			.attr( "data-src", "php/loadImage.php?id=" + d.pointer + '&size=small')
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
			.appendTo( $entry );
		_.each( DataVars.data.headers, function(header,prop){
			if ( !header.tag || !d[prop] ) return;
			$textContainer.append( "<p class='tag-header'><strong>" + header.name.toUpperCase() + ":</strong> " + getTagLinks(d[prop]) + "</p>" );
		});
		
		var foundStudentReport = false,
			$studentReports = $( '<div id="studentReports"><strong>STUDENT REPORTS: </strong></div>');
		_.each( DataVars.reports, function( entry, index ){
			if( _.indexOf( entry.Documents, d.pointer ) >= 0 ){
				foundStudentReport = true;
				var $buttonDiv = $( '<div/>', {
					'class': 'button',
					html : 'View Report <i class="fa fa-chevron-right"></i>'
				})
				.on( 'click', function(){
					loadReport( entry );
				});
				$( '<div><p class="italic">' + entry.Title + '</p></div>' ).appendTo( $studentReports ).append( $buttonDiv );
				
			}
		});
		if( foundStudentReport === true ) $studentReports.appendTo( $textContainer );

		$( "a.tag-link", $entry ).click( function(){
			var name = $(this).html();
			var $tags = $( '.tag' ).filter( function() {
				return $( this ).text() === name;
			});
			if( $tags.length >= 1 ) {
				$tags.click();
			} else{
				createTempTag( name );
			}
		});

		$( '<div class="image-expand"><i class="fa fa-expand fa-2x"></i></div>' )
			.appendTo( $imageContainer )
			.on( 'click', function(){
				lightboxEntry( $entry, d );
			});

		$div.append( $entry );
	});
	expandEntry( $(".timeline-entry.e0", $div) );
}

function selectYear( year, noAutoScroll, noImages ){
	if ( year == undefined || !$( "#year" + year).length ) return;
	$( ".timeline-year.active" ).removeClass( "active" );
	$( ".pulse-circle.active" ).removeClass( "active" );
	$( "#year" + year).addClass( "active" );
	$( ".p" + year).addClass( "active" );
	$( "#year" ).html( year );
	
	$( '.timeline-year.show-year' ).toggleClass( 'show-year hide-year' );
	
	$( '.timeline-year.active' ).prev().prev().toggleClass( 'show-year hide-year' );
	$( '.timeline-year.active' ).prev().toggleClass( 'show-year hide-year' );
	$( '.timeline-year.active' ).toggleClass( 'show-year hide-year' );
	$( '.timeline-year.active' ).next().toggleClass( 'show-year hide-year' );
	$( '.timeline-year.active' ).next().next().toggleClass( 'show-year hide-year' );

	AppVars.selectedYear = year;
	if ( !noAutoScroll ) recenterTimeline();

	if ( noImages ) return;
	loadTimelineImages( year );	// load selected year images before surrounding years
	
	selectPoint( $( '.timeline-year.active .db-entry:first' ).attr( 'id' ).replace( 'entry', '' ) );
}

function advanceTimeline(){
	if ( AppVars.selectedYear == undefined ) return;
	if ( $( '.timeline-year.active' ).next().length == 0 ) return;
	selectYear( $( '.timeline-year.active' ).next().attr( 'id').slice(-4) );
}

function rewindTimeline(){
	if ( AppVars.selectedYear == undefined ) return;
	if ( $( '.timeline-year.active' ).prev().length == 0 ) return;
	selectYear( $( '.timeline-year.active' ).prev().attr( 'id').slice(-4) );
}

function recenterTimeline(){
	if ( !$( ".timeline-year.active" ).length ) return;
	var left = $( ".timeline-year.active" ).index() * $( ".timeline-year" ).outerWidth()
			- ( $( "#timeline" ).width()  - $( ".timeline-year" ).outerWidth() ) / 2;
	$( "#timeline-inner" ).off( "scroll" )
		.stop()
		.animate( { scrollLeft: left }, function(){
			$( "#timeline-inner" ).on( "scroll", timelineScroll );
		});
	AppVars.timelineRecenterFlag = false;
}

function timelineScroll(){
	var left = $( this ).scrollLeft() + $("#timeline").width() / 2,
		index = parseInt( left / 400 );
	var year;
	
	if ( left == 0 ) year = $( '.timeline-year' ).first();
	else if ( Math.abs( left - ($( '.timeline-year' ).length - $( this ).parent().width()) ) < 10 ) year = $( '.timeline-year:nth-of-type(' + $( '.timeline-year' ).length - 1 + ')' );
	else year = $( '.timeline-year:nth-of-type(' + ( index + 1 ) + ')' ).attr( 'id').slice(-4);
	
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
function getTagLinks( tag ){
	var tags = tag.replace(/; /g,";").split(";");
	tags.forEach( function(t){
		tag = tag.replace( t, "<a class='tag-link' href='#'>" + t + "</a>" );
	});
	return tag;
}

function drawChronology(){
	if ( !DataVars.chronologyData.length || !AppVars.years || !AppVars.years.length ) return;
	_.each( DataVars.chronologyData, function(d){
		var startYear = parseInt( d.start.match(/\d{4}/)[0] ),
			endYear = d.end ? d.end.match(/\d{4}/)[0] : startYear;
			
		var textDate = startYear !== endYear ? startYear + '-' + endYear : startYear;
		
		_.each( AppVars.years, function(y, index){
			if( y < startYear ) {
				return; 
			} else if (index == 0) {
				var chronoYear = y;
			} else if( y == startYear ){
				var chronoYear = startYear;
			} else if( y > startYear && AppVars.years[index-1] < startYear ){
				var chronoYear = y;
			} else {
				return;
			}
			
			var $year = $( '#year' + chronoYear );
			
			//first chrono entry
			if( $( '.chronology', $year ).length == 0 ){
				$( '<div class="chronology">' )
					.prependTo( $year );
				$( "<div class='chrono-entry'>" )
					.html( '<i class="fa fa-clock-o"></i><span>' + textDate + '</span> | '  )
					.appendTo( $( '.chronology', $year ) )
					.append( '<span>' + d.text + '</span>' );
				return;
			}
			
			//second chrono entry setup
			if( $( '.chrono-entry', $year ).length === 1 ){
				$( '<p class="chrono-title">' )
					.prependTo( $('.chronology', $year ) )
					.html( '<i class="fa fa-clock-o"></i><span>Events leading up to ' + chronoYear + '</span><i class="fa fa-chevron-right"></i>')
					.on('click', function(){
						if( $( this ).parent().parent().hasClass( 'active' ) ){
							$( '.chrono-entries', $year ).slideToggle();
							$( '.chrono-title i', $year ).eq(1).toggleClass( 'fa-chevron-right fa-chevron-down' );
						}
					});
				
				var $firstChrono = $( '.chrono-entry', $year ).clone();
				$( '.chrono-entry', $year ).remove();

				$( '.fa-clock-o', $firstChrono ).remove();
				
				$( '<div class="chrono-entries">' )
					.appendTo( $( '.chronology', $year) )
					.append( $firstChrono );
			}
			
			//subsequent chrono entries
			$( "<div class='chrono-entry'>" )
					.html( '<span>' + textDate + '</span> | '  )
					.appendTo( $( '.chrono-entries', $year ) )
					.append( '<span>' + d.text + '</span>' );
			
		});
	});
}