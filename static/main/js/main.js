/**
 * Created by Stepan on 06.12.14.
 */
$(document).ready(function(){
   	$('.gallery .main-image > a').magnificPopup({
		type: 'image',
		closeOnContentClick: true
	});

    $('.popup-gallery').magnificPopup({
		delegate: 'a',
		type: 'image',
		tLoading: 'Loading image #%curr%...',
		mainClass: 'mfp-img-mobile',
		gallery: {
			enabled: true,
			navigateByImgClick: true,
			preload: [0,1] // Will preload 0 - before current, and 1 after the current image
		}
	});
});