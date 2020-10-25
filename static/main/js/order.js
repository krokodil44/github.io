/**
 * Created by Stepan on 12.10.15.
 */
var Order = (function(){
	var orders,
		schedule,
		isMobile,
		$datepicker;

	var genitive = [
        "января", "февраля", "марта", "апреля", "мая", "июня", "июля",
        "августа", "сентября", "октября", "ноября", "декабря"
    ];

	var days = [
		"воскресенье", "понедельник", "вторник", "среда", "четверг",
		"пятница", "суббота"
	];

	function getTextDate(date) {
		var month = genitive[date.getMonth()];
		var dayOfWeek = days[date.getDay()];
		var day = date.getDate();
		var text = dayOfWeek + ", " + day + " " + month;
		return text.toUpperCase();
	}

	function dateDiff(first, second) {
		first.setHours(0, 0, 0, 0);
		second.setHours(0, 0, 0, 0);
		return Math.round((second-first)/(1000*60*60*24).toFixed(0))
	}

	function updateNavActions() {
		var date = $datepicker.datepicker('getDate');
		var curentDate = new Date();
		var diff = dateDiff(curentDate, date);
		if (diff <= 0) {
			$('.calendar .prev').addClass('disabled');
		} else {
			$('.calendar .prev').removeClass('disabled');
		}
		if (diff >= 29) {
			$('.calendar .next').addClass('disabled');
		} else {
			$('.calendar .next').removeClass('disabled');
		}
	}

	/**
	 * Изменение след, предыдущего дня
	 * @param e
	 */
	function changeDay(e) {
		e.preventDefault();
		e.stopPropagation();
		var date = $datepicker.datepicker('getDate');
		var $target = $(e.target);
		if ($target.hasClass('disabled')) {
			return;
		}
		if ($target.hasClass('prev')) {
			date.setTime(date.getTime() - (1000*60*60*24));
		} else {
			date.setTime(date.getTime() + (1000*60*60*24));
		}
		$datepicker.datepicker("setDate", date);
		datePickerChange(date);
		updateNavActions();
		generateSchedule(date);
	}

	function clickTimeCostHandler(e) {
		var $target = $(e.target);
        if ($target.hasClass('disabled')) {
            return;
        }
		$('.time-cost .cost').removeClass('selected');
		$target.addClass('selected');
		var $timeCost = $target.closest('.time-cost');
        var time = $timeCost.find('.time').text();
        $('[name=time]').val(time);
        var cost = $timeCost.find('.cost').text();
        $('[name=cost]').val(cost);
        $('.confirm .time').text(time).closest('.hidden').removeClass('hidden');

		var date = $datepicker.datepicker('getDate');
		var dateText = date.getDate() + " " +
				genitive[date.getMonth()] + " " + date.getFullYear();
        $('.confirm .date').text(dateText).closest('.hidden').removeClass('hidden');
		$('[name=date]').val(
			date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
		);
		var $questSchedule = $target.closest('.quest-schedule');
		var questName = $questSchedule.find('.quest').text();
        $('.confirm .quest-name').text(questName).closest('.hidden').removeClass('hidden');

		$('[name=quest]').val($questSchedule.data("quest-id"));
    }

	function orderHandler(event) {
		event.preventDefault();
        event.stopPropagation();
        var error = null;
        $('#quest-order-form input').each(function(){
            if ($.trim($(this).val()) == "") {
                error = "Пожалуйста, заполните все поля";
                return;
            }
            var value = $(this).val();
            if (
                $(this).is('[name=name]') &&
				(
					value.length < 3 ||
					!/^[а-яёА-ЯЁ0-9 ]+$/.test(value)
				)
            ) {
                error = 'Некоректно заполнено имя';
                return;
            }
            if (
                $(this).is('[name=phone]') &&
				(
					value.length < 5 ||
					!/^[0-9\+\- ]+$/.test(value)
				)
            ) {
                error = 'Некоректно заполнен телефон';
                return;
            }
            if ($(this).is('[name=email]') && !validateEmail(value)) {
                error = 'Некоректно заполнен email';
                return;
            }
        });
        if (error) {
            alert(error);
            return;
        }
        $('#quest-order-form').ajaxSubmit({
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

    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

	/**
	 * Уставливает дату в заголовок
	 * @param Date date
	 */
	function datePickerChange(date) {
		var dateText = getTextDate(date);
		$('.calendar .date').text(dateText);
	}

	function getTimesFromSchedule(date) {
		for (var i = 0; i < schedule.length; i++) {
			if (
				schedule[i][2] == date.getDate() &&
				schedule[i][1] == (date.getMonth() + 1) &&
				schedule[i][0] == date.getFullYear()
			) {
				return schedule[i][4];
			}
		}
	}

	function isOrdered(questId, dateText, time, cost) {
		for (var i = 0; i < orders.length; i++) {
			var fields = orders[i].fields;
			if (
				fields.quest == questId &&
				fields.date == dateText &&
				fields.time == time &&
				fields.cost == cost
			) {
				return true;
			}
		}
		return false;
	}

	function generateSchedule(date) {
		var quests = getTimesFromSchedule(date);
		$.each(quests, function(questId, times){
			var $quest = $('[data-quest-id=' + questId + ']');
			var $schedule = $quest.find('.schedule');
			$schedule.html('');
			$.each(times, function(i, el){
				var dateText =
					$datepicker.datepicker({ dateFormat: 'yy-mm-dd' }).val();
				var disabled = '';
				if (isOrdered(questId, dateText, el.time, el.cost)) {
					disabled = 'disabled'
				}
				$schedule.append(
					'<div class="time-cost">'+
						'<div class="time">'+ el.time + '</div>' +
						'<div class="cost ' + disabled + '">'+ el.cost + '</div>' +
					'</div>'
				);
			});
		});
		$('.time-cost .cost')
			.off('click')
			.on('click', clickTimeCostHandler)
	}

	var init = function(option1, option2, isMobileOpt, icon) {
		var currentDate = new Date();
		var dateText = getTextDate(currentDate);
		$('.calendar .date').text(dateText);
		orders = option1;
		schedule = option2;
		isMobile = isMobileOpt;
		$datepicker = $("#datepicker");
		$.datepicker.setDefaults($.extend($.datepicker.regional["ru"]));
		var datepickerData = {
			dateFormat: "yy-mm-dd",
			minDate: 0,
			maxDate: "+29d",
			showOn: "button",
			buttonImage: icon,
			buttonImageOnly: true,
			buttonText: "Select date",
			dayNamesMin: ['вc', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
			onSelect: function (date, inst) {
				date = new Date(date);
				datePickerChange(date);
				updateNavActions();
				generateSchedule(date);
			}
		};
		$datepicker.datepicker(datepickerData);
		$datepicker.datepicker('setDate', currentDate);
		$('.calendar .nav').on('click', changeDay);
		updateNavActions();
		generateSchedule(currentDate);
		$('#book').on('click', orderHandler);
	};

	return {
		init: init,
		schedule: schedule
	};
})();