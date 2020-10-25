/**
 * Created by Stepan on 17.10.15.
 */

/**
 * Модуль для бронирования подарков
 */
var Present = function() {
	function orderPresent(event) {
        event.preventDefault();
        event.stopPropagation();
        var isEmpty = false;
        $('#card-form input').each(function(){
            if ($.trim($(this).val()) == "") {
                isEmpty = true;
            }
        });
        if (isEmpty) {
            alert("Пожалуйста, заполните все поля");
            return;
        }
        $('#card-form').ajaxSubmit({
            success: function() {
                alert('Ваша заявка принята');
                $('#card-form input').each(function(){
                    $(this).val("");
                });
            },
            error: function() {
                alert('Произошла ошибка');
            }
        });
	}

	return {
		init: function() {
			$('#submit-card-form').on('click', orderPresent);
		}
	};
}();