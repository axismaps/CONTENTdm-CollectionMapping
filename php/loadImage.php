<?php

if( array_key_exists( 'id', $_REQUEST ) ){
	$id = $_REQUEST['id'];
} else {
	$id = 37;
}

if( ! file_exists( getcwd(). '\images\\' . $id . '-0.jpg' ) ){
	file_put_contents( 'temp.pdf', file_get_contents( 'http://cdm15963.contentdm.oclc.org/utils/getfile/collection/p15963coll18/id/' . $id ) );

	//check amount of pages in pdf
	$im = new Imagick();
	$im->readimage( getcwd() . '\temp.pdf' );
	$pages = $im->getNumberImages();
	$im->clear();
	$im->destroy();

	//go through each pdf page and convert to jpg
	$imagick = new Imagick();
	$imagick->setResolution(300,300);

	$i = 0;
	while( $i <= $pages - 1 ){
		$imagick->readimage( getcwd() . '\temp.pdf[' . $i . ']' );
		$imagick->setImageFormat( 'jpeg' );
		$imagick->writeImage( getcwd() . '\images\\' . $id . '-' . $i . '.jpg' );
		$i++;
	}
	$imagick->clear();
	$imagick->destroy();
	
	unlink( "temp.pdf" );
}

header( "Location: images/$id-0.jpg" );

?>