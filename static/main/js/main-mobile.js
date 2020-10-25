/**
 * Created by Stepan on 05.10.15.
 */

var MobileSite = (function() {

	var $menu = $('.menu-open'), $questSlideDown = $('.quest-info-right');

	function menuHandler() {
		if ($menu.hasClass('opened')) {
			$menu.removeClass('opened');
		} else {
			$menu.addClass('opened');
		}
	}

	function questSlideDownHandler(event) {
		var $target = $(event.target),
			$quest = $target.closest('.quest'),
			$fullInfo = $quest.find('.full-info');
		console.log($fullInfo);
		if ($quest.hasClass('opened')) {
			$quest.removeClass('opened');
			$fullInfo.slideUp();
		} else {
			$quest.addClass('opened');
			$fullInfo.slideDown();
		}
	}

	function init() {
		$menu.on('click', menuHandler);
		$questSlideDown.on('click', questSlideDownHandler);
	}

	return {
		init: init
	};
}());

$(document).ready(function(){
	MobileSite.init();
});
