<?php

if( array_key_exists( 'id', $_GET ) ){
	$id = $_GET['id'];
} else {
	// return
	$id = 0; //set something so it doesn't crash TODO: return unloaded picture or generic image
}

if( array_key_exists( 'size', $_GET ) ) {
	$size =  $_GET['size'];
} else {
	$size = 'full';
}

if( ! file_exists( 'images\\' . $id . '-' . $size . '.jpg' ) ){
	$file_info = json_decode( file_get_contents( 'http://server15963.contentdm.oclc.org/dmwebservices/index.php?q=dmGetItemInfo/p15963coll18/' . $id . '/json' ) );
	
	//file is a pdf
	if( substr( $file_info->{'find'}, -3 ) == 'pdf' ) {
		
		$i = 0;
		while( file_exists( 'temp' . $i . '.pdf' )) {
			$i++;
		}
		
		file_put_contents( 'temp' . $i . '.pdf', file_get_contents( 'http://cdm15963.contentdm.oclc.org/utils/getfile/collection/p15963coll18/id/' . $id ) );

		//convert pdf page to jpg
		$imagick = new Imagick();
		$imagick->setResolution(300,300);
		
		$imagick->readimage( getcwd() . '\temp' . $i . '.pdf[0]' );
		$imagick->setImageFormat( 'jpeg' );
		$imagick->writeImage( getcwd() . '\images\\' . $id . '-full.jpg' );
			
		$imagick->scaleImage( 400, 0 );
		$imagick->writeImage( getcwd(). '\images\\'. $id . '-small.jpg' );
					
		$imagick->clear();
		$imagick->destroy();
		
		unlink( "temp" . $i . ".pdf" );
	} elseif ( substr( $file_info->{'find'}, -3 ) == 'jpg' OR substr( $file_info->{'find'}, -4 ) == 'jpeg' ){
		
		$i = 0;
		while( file_exists( 'temp' . $i . '.jpg' )) {
			$i++;
		}
		
		file_put_contents( 'temp' . $i . '.jpg', file_get_contents( 'http://cdm15963.contentdm.oclc.org/utils/getfile/collection/p15963coll18/id/' . $id ) );
		
		$imagick = new Imagick();
		$imagick->readimage( getcwd() . '\temp' . $i . '.jpg' );
		$imagick->setImageFormat( 'jpeg' );
		$imagick->writeImage( getcwd() . '\images\\' . $id . '-full.jpg' );
		
		$imagick->scaleImage( 400, 0 );
		$imagick->writeImage( getcwd(). '\images\\'. $id . '-small.jpg' );
		
		$imagick->clear();
		$imagick->destroy();
		unlink( "temp" . $i . ".jpg" );
	}
}

header( "Location: images/$id-$size.jpg", TRUE, 302 );
exit;
?>