<?php

if( checkCacheAge() OR $_REQUEST["force"] ) {
	loadData();
}

$data = fopen( 'data.json', 'r' );
echo fgets( $data );
fclose( $data );


function checkCacheAge() {
	return false;
}

function loadData( ){
	$ch = curl_init();
	$temp = fopen( "temp.json", "w" );
	
	curl_setopt( $ch, CURLOPT_SSL_VERIFYPEER, false); //TODO: Trust actual certificate instead of all certificates. Do we need to do this or not?
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