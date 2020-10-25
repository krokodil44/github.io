/**
 * Created by Stepan on 07.12.14.
 */
/* Russian initialisation for the jQuery UI date picker plugin. */
(function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define(["jquery.ui.datepicker"], factory );
	} else {

		// Browser globals
		factory( jQuery.datepicker );
	}
}(function( datepicker ) {
	datepicker.regional['ru'] = {
		closeText: 'Закрыть',
		prevText: 'Предыдущий',
		nextText: 'Следующий',
		currentText: 'Текущий',
		monthNames: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
			'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
		monthNamesShort: ['янв.', 'фев.', 'март', 'апр.', 'май', 'июнь',
			'июль', 'авг.', 'сен.', 'окт.', 'нояб.', 'дек.'],
		dayNames: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
		dayNamesShort: ['вос.', 'пон.', 'вт.', 'ср.', 'чет.', 'пят.', 'суб.'],
		dayNamesMin: ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'],
		weekHeader: 'Sem.',
		dateFormat: 'dd/mm/yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	datepicker.setDefaults(datepicker.regional['ru']);

	return datepicker.regional['ru'];

}));