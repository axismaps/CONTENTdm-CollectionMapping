<?php

//TODO: if no cache file present on system, run loadData() (probably only needed for first run, but good to have it anyways
if( checkCacheAge() OR $_REQUEST["force"] ) {
	loadData();
}

$data = fopen( 'data.json', 'r' );
echo fgets( $data );
fclose( $data );


function checkCacheAge() {
	//TODO: return false if cache file less than a week old
	return false;
}

function loadData( ){
	//TODO: if fields is greater than 5, need to make 2 or more cURL requests and merge
	
	$ch = curl_init();
	$temp = fopen( "temp.json", "w" );
	
	 //TODO: Trust actual certificate instead of all certificates. Do we need to do this or not?
	curl_setopt( $ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt( $ch, CURLOPT_FILE, $temp );
	
	$url = "https://server15963.contentdm.oclc.org/dmwebservices/index.php?q=dmQuery/";
	$url = $url . $_REQUEST["collection"] . '/0/title';
	if( ! empty ( $_REQUEST["fields"] ) ) {
		foreach( $_REQUEST["fields"] as $field ) {
			$url = $url . '!' . $field;
		}
	}
	$url = $url . "/title/1024/1/0/0/0/0/0/0/json";
	
	curl_setopt( $ch, CURLOPT_URL, $url );
	
	if( curl_exec( $ch ) === false ) {
		echo 'Curl error: ' . curl_error( $ch );
	}
	
	curl_close( $ch );
	fclose( $temp );
	
	processData();
}

function processData(){
	$temp_file = fopen( "temp.json", "r" );
	$temp_json = json_decode( fgets ( $temp_file ) );
	
	$json_file = fopen( "data.json", "w" );
	
	$formats = [];
	$tags = [];
	$minYear = 9999;
	$maxYear = 0;
	$entries = [];
	
	foreach( $temp_json -> records as $value ) {
		array_push( $entries, $value );
		if ( ! in_array( $value -> filetype, $formats ) )
			array_push( $formats, $value -> filetype );
		if ( ! in_array( $value -> filetype, $tags ) )
			array_push( $tags, $value -> filetype );
		if ( $minYear > substr( $value -> {'date'}, 0, 4 ) )
			$minYear = substr( $value -> {'date'}, 0, 4 );
		if ( $maxYear < substr( $value -> {'date'}, 0, 4 ) )
			$maxYear = substr( $value -> {'date'}, 0, 4 );
	}
	
	$json = [ 
		'formats' => $formats,
		'tags' => $tags,
		'minYear' => $minYear,
		'maxYear' => $maxYear,
		'entries' => $entries,
	];
	
	fwrite( $json_file, json_encode( $json, JSON_NUMERIC_CHECK ) );
	fclose( $json_file );
	
	fclose( $temp_file );
	unlink( "temp.json" );
}

?>