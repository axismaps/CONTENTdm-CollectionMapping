<?php

if( array_key_exists( 'id', $_GET ) ){
	$id = $_GET['id'];
} else {
	$id = 0; //set something so it doesn't crash
}

if( array_key_exists( 'size', $_GET ) ) {
	$size =  $_GET['size'];
} else {
	$size = 'full';
}

if( ! file_exists( 'cache/' . $id . '-' . $size . '.jpg' ) ){
	$file_info = json_decode( file_get_contents( 'http://server15963.contentdm.oclc.org/dmwebservices/index.php?q=dmGetItemInfo/p15963coll43/' . $id . '/json' ) );
	
	//file is a pdf
	if( substr( $file_info->{'find'}, -3 ) == 'pdf' ) {
		
		file_put_contents( 'temp' . $id . '.pdf', file_get_contents( 'http://cdm15963.contentdm.oclc.org/utils/getfile/collection/p15963coll43/id/' . $id ) );

		//convert pdf page to jpg
		$imagick = new Imagick();
		$imagick->setResolution(300,300);
		
		$imagick->readimage( getcwd() . '/temp' . $id . '.pdf[0]' );
		$imagick->setImageFormat( 'jpeg' );
		$imagick->writeImage( getcwd() . '/cache/' . $id . '-full.jpg' );
			
		$imagick->scaleImage( 400, 0 );
		$imagick->writeImage( getcwd() . '/cache/' . $id . '-small.jpg' );
					
		$imagick->clear();
		$imagick->destroy();
		
		unlink( "temp" . $id . ".pdf" );
	} elseif ( substr( $file_info->{'find'}, -3 ) == 'jpg' OR substr( $file_info->{'find'}, -4 ) == 'jpeg' ){
		
		file_put_contents( 'temp' . $id . '.jpg', file_get_contents( 'http://cdm15963.contentdm.oclc.org/utils/getfile/collection/p15963coll43/id/' . $id ) );
		
		$imagick = new Imagick();
		$imagick->readimage( getcwd() . '/temp' . $id . '.jpg' );
		$imagick->setImageFormat( 'jpeg' );
		$imagick->writeImage( getcwd() . '/cache/' . $id . '-full.jpg' );
		
		$imagick->scaleImage( 400, 0 );
		$imagick->writeImage( getcwd() . '/cache/'. $id . '-small.jpg' );
		
		$imagick->clear();
		$imagick->destroy();
		unlink( "temp" . $id . ".jpg" );
	}
}

header( "Location: cache/$id-$size.jpg" );
exit;
?>