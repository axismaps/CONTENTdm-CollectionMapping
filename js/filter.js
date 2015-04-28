//type can be either alpha or date strings
function filter( type ){
	var filters = DataVars.filters,
		data = DataVars.data;
		
	console.log( 'filtering' );
	console.log( filters );
		
	//Default parameters, exit early for performance
	if( filters.minYear === 0 && filters.maxYear === 9999 && filters.tags.length === 0 && filters.format.length === 0 ) {
		DataVars.filteredData = data;
	} else {
	
		var fD = {
			minYear: 9999,
			maxYear: 0,
			entries: []
		};
		
		_.each( data.entries, function( v ) {
			//filters
			if( v.date.year < filters.minYear ) return false;
			if ( v.date.year > filters.maxYear ) return false;
			if ( filters.format.length > 0 && _.indexOf( filters.format, v.format ) == -1 ) return false;
			
			//update minYear and maxYear and push onto array
			if( fD.minYear >= v.date.year ) fD.minYear = v.date.year;
			if( fD.maxYear <= v.date.year ) fD.maxYear = v.date.year;
			fD.entries.push( v );
		});
		
		DataVars.filteredData = fD;
	}
	
	if( type == 'date' ) sort();
	
	console.log( DataVars.filteredData );
}

function update(){
	
}

function sort(){
	var fD = DataVars.filteredData;
	DataVars.filteredData = _.sortBy( fD.entries, function( entry ){
		return entry.date.year;
	});
}