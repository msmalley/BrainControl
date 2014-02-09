var $ = jQuery;

$(document).ready(function(e){
	mb_browser();
})

function mb_browser()
{
	var is_webkit = false;
	var is_chrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
	var is_safari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
	if(is_chrome || is_safari) is_webkit = true;
	if(is_webkit) $('html').addClass('webkit');
}

function mb_alert(content, close, title, redirect, button, id, reload){
	if(!id) id = 'default';
	if(!title) title = '';
	modal_window = $('#mb_modal_'+id);
	primary_button = $(modal_window).find('.btn-primary');
	/* SET DATA */
	$(modal_window).find('#mb_modal_'+id+'_label').html(title);
	if(content) $(modal_window).find('.modal-body').html(content);
	$(modal_window).find('button.closer').html(close);
	$(modal_window).find('.btn-primary').html(button);
	if(button){
		$(primary_button).show();
		$(primary_button).on('click', function (e) {
			e.preventDefault();
			if(typeof window['mb_modal_'+id+'_primary_button_callback'] == 'function') {
				window['mb_modal_'+id+'_primary_button_callback'](id, title, redirect, content, close, button);
			}
		});
		$(modal_window).on('hidden.bs.modal', function () {
			if(reload) location.reload();
		});
	}else{
		$(primary_button).hide();
		$(modal_window).on('hidden.bs.modal', function () {
			if(typeof window['mb_modal_'+id+'_hidden_callback'] == 'function') {
				window['mb_modal_'+id+'_hidden_callback'](id, title, redirect, content, close, button);
			}else{
				if(redirect) window.location = redirect;
				else if(reload) window.location.reload();
			}
		});
	}
	$(modal_window).modal('show');
}

function mb_env_data(attribute)
{
	return $('body').attr('data-'+attribute);
}

function mb_set_cookie(name, value, days, exact_time) {
    if (days) {
        var date = new Date();
		if(exact_time)
		{
			date.setTime(exact_time);
		}
		else
		{
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		}
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

function mb_get_cookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

function mb_data_tables()
{
	$('.mb-data-table').each(function(){
		var table = $(this);
		var data = jQuery.parseJSON($(table).attr('data-data'));
		var columns = jQuery.parseJSON($(table).attr('data-columns'));
		$(table).dataTable({
			"aaData": data,
			"aoColumns": columns
		});
	});
}