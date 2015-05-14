function initSearch(){	
	$( '#search .typeahead' ).typeahead({
		highlight: true,
		minLength: 2
	},{
		name: 'searchResults',
		source: search(),
		templates: { 'empty': noResults, 'suggestion': renderSuggestion }
	});
	
	$( '.typeahead' ).on( 'keypress', function( ){
		$( '#search-clear' ).show();
	});
	
	$( '.typeahead' ).on( 'typeahead:selected', function( e, suggestion ){
		displayResults( suggestion );
	});
	
	$( '#search-clear' ).on( 'click', function(){
		$( '#search .typeahead' ).typeahead( 'val', '' );
		$( '#search .typeahead' ).focus();
		$( this ).hide();
	});
}

var search = function(){
	return function findMatches( q, cb ){
		var visibleMatches=[],
			filteredMatches = [],
			allMatches,
			substringRegex = new RegExp(q, 'i' );
			
		_.each( DataVars.data.entries, function( v, k, l ){
			if( substringRegex.test( v.descri ) || substringRegex.test( v.title ) 
				|| _.some(v.tags, function(t){ return substringRegex.test( t ) }) ){
				if ( $( '#entry' + v.pointer ).length )
					visibleMatches.push( {'value': v.title, 'pointer': v.pointer, 'year': v.date.year });
				else
					filteredMatches.push( {'value': v.title, 'pointer': v.pointer, 'year': v.date.year, 'filtered': true });
			}
		});

		if ( filteredMatches.length ){
			allMatches = visibleMatches.concat( {value:''}, filteredMatches );
		} else {
			allMatches = visibleMatches;
		}
		
		cb( allMatches );

	};
};

function noResults(query){
	return "<div class='tt-empty'><p>No results found.</p></div>";
}
function renderSuggestion(query){
	if ( query.filtered ){
		return '<div class="filtered-result"><p>' + query.value +'</p></div>';
	} else if ( query.value !== '' ){
		return '<div><p>' + query.value +'</p></div>';
	} else {
		if ( $( 'body' ).hasClass( 'report' ) ) return '<div class="filter-header"><p>The following results are not included in the current report. Selecting one will exit the report.</p></div>';
		return '<div class="filter-header"><p>The following results are not visible with current filters. Selecting one will clear active filters.</p></div>';
	}
}

function displayResults( suggestion ){
	if ( suggestion.value === '' ) return;
	if ( suggestion.filtered ) $( '#all-docs-button' ).click();
	AppVars.selectedPoint = suggestion.pointer;
	selectYear( suggestion.year );
	$( '#entry' + suggestion.pointer + ' .entry-title' ).click();
}