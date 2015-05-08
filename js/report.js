function initReports(){
	$( '#reports-expanded' ).show();
	if ( $( "#reports-accordion" ).length ) return;
	
	$( '<div/>', {
		id: "reports-accordion"
	}).appendTo( '#reports-expanded .expanded-section' );
	
	$.map( DataVars.reports, function( v ) {
		var $title = $( '<h3><i class="fa fa-folder"></i> <span>' + v.Title + '</span></h3>' ).appendTo( '#reports-accordion' );
		
		$( '#reports-accordion' ).append( '<div class="reports-accordion-content"/>' );
		
		var url = 'php/loadImage.php?id=' + v.CoverImage + '&size=small';
		var width = $( '#reports-accordion' ).width();
		
		$( '<div/>', {
			'class' : 'accordion-image'
		}).appendTo( '#reports-accordion > div:last-child' ).css({
			'background-image':  'url(' + url + ')',
			width: width + 'px',
			height: width + 'px'
		});
		
		$( '<div/>' )
			.appendTo( '#reports-accordion > div:last-child > div' )
			.html( '<i class="fa fa-expand fa-2x"></i>' )
			.on( 'click', function(){
				//TODO: Show lightbox of report summary
				console.log( 'Show lightbox here' );
		});

		$title.css( 'background-image', 'url(' + url + ')' )
			.prepend( '<div class="mask">' );

		
		$( '<p/>' ).appendTo( '#reports-accordion > div:last-child' ).text( v.Description ).succinct({
			size: 300
		});
		
		$( '<div/>', {
				'class': 'button',
				html : 'View Report <i class="fa fa-chevron-right"></i>'
		}).appendTo( '#reports-accordion > div:last-child' )
		.on( 'click', function(){
			//TODO: Show full report on click
			console.log( v );
			lightboxReport( $( this ).parent(), v );
		});
	});
	
	$( '#reports-accordion' ).accordion({
		heightStyle: "content",
		icons: false
	});
}

function loadReport(){
	
}

function showReportInfo(){
	
}