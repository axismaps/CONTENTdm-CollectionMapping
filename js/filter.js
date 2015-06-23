//type can be either alpha or date strings
function filter( type ){
	var filters = DataVars.filters,
		data = DataVars.data;

	$( "#filters-button span" ).html( "Filters" );
	$( "#tags-button span" ).html( "Tags" );
		
	//Default parameters, exit early
	if( filters.minYear === DataVars.data.minYear && filters.maxYear === DataVars.data.maxYear && filters.tags.length === 0 && filters.category.length === 0 ) {
		DataVars.filteredData = data;
	} else {
	
		var fD = {
			minYear: 9999,
			maxYear: 0,
			entries: []
		};
		
		var filterCount = filters.category.length;

		if ( filters.minYear !== DataVars.data.minYear || filters.maxYear !== DataVars.data.maxYear ) filterCount ++;
		if ( filterCount ) $( "#filters-button span" ).html( "Filters (" + filterCount + ")" );

		var tagCount = filters.tags.length;
		if ( filters.minYear !== 0 || filters.maxYear !== 9999 ) filterCount ++;
		if ( tagCount ) $( "#tags-button span" ).html( "Tags (" + tagCount + ")" );

		_.each( data.entries, function( v ) {
			//filters
			if( v.date.year < filters.minYear ) return false;
			if( v.date.year > filters.maxYear ) return false;
			if( filters.category.length > 0 && _.indexOf( filters.category, v.category ) == -1 ) return false;

			var tag_value = filters.tags.length ? false : true;
			_.each( v.tags, function( tag ) {
				if( filters.tags.length > 0 && _.indexOf( filters.tags, String( tag ) ) >= 0 ) tag_value = true;
			});
			if( tag_value == false ) return false;

			//update minYear and maxYear and push onto array
			if( fD.minYear >= v.date.year ) fD.minYear = v.date.year;
			if( fD.maxYear <= v.date.year ) fD.maxYear = v.date.year;
			fD.entries.push( v );
		});
		
		DataVars.filteredData = fD;
	}
	
	if( type == 'date' ) sortByDate();

	update();
}

function sortByDate(){
	var fD = DataVars.filteredData;
	DataVars.filteredData = _.sortBy( fD.entries, function( entry ){
		return entry.date.year;
	});
}