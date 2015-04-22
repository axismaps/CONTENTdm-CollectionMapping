<?php

// Check age of cache file
if( checkCacheAge() ) {
	//refresh cache
	loadData();
	//process data into json
	processData();
}


function checkCacheAge() {
	
	return true;
}

function loadData( fields ){
	
}

function processData( data ){
	
}

?>