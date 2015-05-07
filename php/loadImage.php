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

if( array_key_exists( 'page', $_GET ) ) {
	$page = $_GET['page'];
} else {
	$page = 0;
}

if( ! file_exists( getcwd(). '\images\\' . $id . '-' . $size . '-' . $page . '.jpg' ) ){
	$file_info = json_decode( file_get_contents( 'http://server15963.contentdm.oclc.org/dmwebservices/index.php?q=dmGetItemInfo/p15963coll18/' . $id . '/json' ) );
	
	//file is a pdf
	if( substr( $file_info->{'find'}, -3 ) == 'pdf' ) {
	
		file_put_contents( 'temp.pdf', file_get_contents( 'http://cdm15963.contentdm.oclc.org/utils/getfile/collection/p15963coll18/id/' . $id ) );

		//check amount of pages in pdf
		$im = new Imagick();
		$im->readimage( getcwd() . '\temp.pdf' );
		$pages = $im->getNumberImages();
		$im->clear();
		$im->destroy();

		//convert pdf page to jpg
		$imagick = new Imagick();
		$imagick->setResolution(300,300);
		
		$i = 0;
		while( $i <= $pages - 1 ){
			$imagick->readimage( getcwd() . '\temp.pdf[' . $i . ']' );
			$imagick->setImageFormat( 'jpeg' );
			$imagick->writeImage( getcwd() . '\images\\' . $id . '-full-' . $i . '.jpg' );
			
			$imagick->scaleImage( 400, 0 );
			$imagick->writeImage( getcwd(). '\images\\'. $id . '-small-' . $i . '.jpg' );
			$i++;
		}
			
		$imagick->clear();
		$imagick->destroy();
		
		unlink( "temp.pdf" );
	} elseif ( substr( $file_info->{'find'}, -3 ) == 'jpg' OR substr( $file_info->{'find'}, -4 ) == 'jpeg' ){
		file_put_contents( 'temp.jpg', file_get_contents( 'http://cdm15963.contentdm.oclc.org/utils/getfile/collection/p15963coll18/id/' . $id ) );
		
		$imagick = new Imagick();
		$imagick->readimage( getcwd() . '\temp.jpg' );
		$imagick->setImageFormat( 'jpeg' );
		$imagick->writeImage( getcwd() . '\images\\' . $id . '-full-0.jpg' );
		
		$imagick->scaleImage( 400, 0 );
		$imagick->writeImage( getcwd(). '\images\\'. $id . '-small-0.jpg' );
		
		$imagick->clear();
		$imagick->destroy();
		unlink( "temp.jpg" );
	}
}

header( "Location: images/$id-$size-$page.jpg" );

?>