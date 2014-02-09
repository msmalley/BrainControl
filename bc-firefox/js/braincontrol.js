// BRAINCONTROL FUNCTION
braincontrol = new function(options){

	// STARTING PANEL
	this.start = function(options)
	{
		if(base.compatible(options) === true)
		{
			var contact_selection = false;
			var saved_contacts = base.get('contacts');
			var default_selection_text = base.lang('Select Contact');
			if(saved_contacts)
			{
				$.each(saved_contacts, function(username, contact)
				{
					if(!contact_selection)
					{
						contact_selection = new Array();
						contact_selection.push({value:'', text:default_selection_text});
					}
					contact_selection.push({value:contact.address, text:contact.name});
				});
				options.forms.send[2].options = contact_selection;
			}
			options = config.settings(options);
			return options;
		}
		else
		{
			bc_starting_point = {
				id: 'step-setup',
				top: false,
				middle: {
					icon: 'times-circle-o',
					warning: base.lang('This device is not compatible<br />localstorage required')
				},
				bottom: {
					buttons: [
						{ href: '#', classes: 'bc-block', text: base.lang('download via github') },
						{ href: '#', classes: 'bc-block', text: base.lang('install wordpress theme') }
					]
				}
			};
			options.panels.push(bc_starting_point);
			return options;
		}
	}

	// MUSTACHE TEMPLATE RENDERING
	this.template = function(file, data, callback)
	{
		if(!data) data = braincontrol.start(config.defaults());
		if(base.really_compatible())
		{
			// ADD MARKET DATA
			var markets = base.get('markets');
			if(markets)
			{

			}

			// ADD ACCOUNT DATA
			var accounts = base.get('accounts');
			if(accounts)
			{
				data['accounts'] = new Array();
				$.each(accounts, function(k, v)
				{
					data['accounts'].push(v);
				})
			}

			// ADD CONTACT DATA
			var contacts = base.get('contacts');
			if(contacts)
			{
				data['contacts'] = new Array();
				$.each(contacts, function(k, v)
				{
					if(v.email || v.tel || v.notes)
					{
						v.extras = new Array();
						v.extras.push({direction: 'down', id: 'step-note'});
					}
					data['contacts'].push(v);
				})
			}
		}
		var template = false;
		var templates = base.get('templates');
		if(templates && templates[file]) template = templates[file];
		else if(!templates) templates = new Object();
		if(template)
		{
			var html = Mustache.render(template, data);
			callback(html);
		}
		else
		{
			$.ajax({
				url: BC_BASE_URL + 'html/'+file+'.html',
				dataType: 'HTML',
				success: function(results)
				{
					var html = Mustache.render(results, data);
					templates[file] = results;
					callback(html);
					if(base.really_compatible !== false)
					{
						base.set('templates', templates);
					}
				}
			})
		}
	}

	// SLIDER
	this.slide = function(direction, id, callback)
	{
		if(direction === 'false') direction = false;
		if(!direction)
		{
			// MUST BE TAB...?
			$('#braincontrol .bc-panel').each(function(i)
			{
				if($(this).attr('id') == 'step-calculator')
				{
					$(this).transition({'left':'-150%'}, 350, function(e){
						$(this).css({'z-index':9});
					});
				}
				else if($(this).attr('id') == 'step-profile')
				{
					$(this).transition({'left':'150%'}, 350, function(e){
						$(this).css({'z-index':9});
					});
				}
				else
				{
					$(this).transition({'top':'-150%'}, 350, function(e){
						$(this).css({'z-index':9,'top':0});
					});
				}
			});
			$('#braincontrol-holder .page').css({'z-index':9});

			if($('#braincontrol-holder #'+id).hasClass('active'))
			{
				$('#braincontrol-holder #'+id).css({'z-index':999});
			}
			else
			{
				$('#braincontrol-holder #'+id).css({'z-index':999, 'left':'150%', 'height':'100%'});
			}

			$('#braincontrol-holder #'+id).transition({'left':0}, 350, function(e)
			{
				$('#braincontrol-holder .page').removeClass('active');
				$(this).addClass('active');

				$('#braincontrol-holder .page').each(function(i){
					if(!$(this).hasClass('active')) $(this).css({'left':'150%','height':1});
				})

				$('#navigation a').each(function(i){
					var aid = $(this).attr('data-id');
					if(aid == id && !$(this).hasClass('active'))
					{
						$('#navigation a').removeClass('active');
						$(this).addClass('active');
					}
				});

				$('#braincontrol #'+id).find('.unessential').each(function(i){
					if($(this).css('display') == 'none' && $(this).attr('id') != 'salt') base.alert($(this).text(), true);
				});

				if(typeof callback == 'function')
				{
					callback();
				}
			});
		}
		else
		{
			if(direction == 'up') $('#braincontrol #'+id).css({'top':'150%'});
			else if(direction == 'down') $('#braincontrol #'+id).css({'top':'-150%'});
			else if(direction == 'right') $('#braincontrol #'+id).css({'left':'-150%'});
			else if(direction == 'left') $('#braincontrol #'+id).css({'left':'150%'});

			$('#braincontrol #'+id).css({'z-index':9999});

			if(direction == 'up' || direction == 'down')
			{
				$('#braincontrol #'+id).transition({'top':0}, 350, function(e)
				{
					$('#braincontrol .bc-panel').css({'z-index':8});
					$('#braincontrol .bc-panel').removeClass('active');
					$(this).addClass('active');
					$(this).css({'z-index':999});
					$('#braincontrol #'+id).find('.unessential').each(function(i){
						if($(this).css('display') == 'none' && $(this).attr('id') != 'salt') base.alert($(this).text(), true);
					});
					if(typeof callback == 'function')
					{
						callback();
					}
				});
			}
			else if(direction == 'right' || direction == 'left')
			{
				$('#braincontrol #'+id).transition({'left':0}, 350, function(e)
				{
					$('#braincontrol .bc-panel').css({'z-index':8});
					$('#braincontrol .bc-panel').removeClass('active');
					$(this).addClass('active');
					$(this).css({'z-index':999});
					$('#braincontrol #'+id).find('.unessential').each(function(i){
						if($(this).css('display') == 'none' && $(this).attr('id') != 'salt') base.alert($(this).text(), true);
					});
					if(typeof callback == 'function')
					{
						callback();
					}
				});
			}
		}
	}

	this.load = function()
	{
		$('#braincontrol').addClass('brain_loading');
		$('#braincontrol .bc-panel, #braincontrol-holder').animate({'opacity':0}, 500, function(e){

		});
	}
	this.unload = function()
	{
		$('#braincontrol .bc-panel, #braincontrol-holder').animate({'opacity':1}, 500, function(e){
			$('#braincontrol').removeClass('brain_loading');
		});
	}

	this.dashboard = function()
	{
		if(base.compatible())
		{
			var count = 0;
			var outdated = false;
			var stats = base.get('stats');
			var now = new Date().getTime();

			if(stats && stats.ts)
			{
				// 10800000 = 3 Hours
				if(now > stats.ts + 10800000) outdated = true;
			}

			if(!stats || (stats && (!stats.price || !stats.transactions || !stats.sent || !stats.hash || !stats.found || !stats.cap)) || outdated)
			{
				stats = new Object();
				stats.ts = now;
				blockchain.query('24hrprice', false, 0, function(results)
				{
					count++;
					var num = parseFloat(results).toFixed(2);
					var figure = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					$('#braincontrol-holder #page-markets #dashboard-usd .figure').text(figure);
					stats['price'] = figure;
					if(count == 6) base.set('stats', stats);
				});
				blockchain.query('24hrtransactioncount', false, 0, function(results)
				{
					count++;
					var figure = results.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					$('#braincontrol-holder #page-markets #dashboard-24tx .figure').text(figure);
					stats['transactions'] = figure;
					if(count == 6) base.set('stats', stats);
				});
				blockchain.query('24hrbtcsent', false, 0, function(results)
				{
					count++;
					var satoshis = results / 100000000;
					var num = parseInt(satoshis);
					var figure = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					$('#braincontrol-holder #page-markets #dashboard-24sent .figure').text(figure);
					stats['sent'] = figure;
					if(count == 6) base.set('stats', stats);
				});
				blockchain.query('hashrate', false, 0, function(results)
				{
					count++;
					var num = parseFloat(results * 1).toFixed(0);
					var figure = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					$('#braincontrol-holder #page-markets #dashboard-hash .figure').text(figure);
					stats['hash'] = figure;
					if(count == 6) base.set('stats', stats);
				});
				blockchain.query('totalbc', false, 0, function(results)
				{
					count++;
					var satoshis = results / 100000000;
					var num = parseInt(satoshis);
					var figure = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					$('#braincontrol-holder #page-markets #dashboard-found .figure').text(figure);
					stats['found'] = figure;
					if(count == 6) base.set('stats', stats);
				});
				blockchain.query('marketcap', false, 0, function(results)
				{
					count++;
					var num = parseFloat(results / 1000000000).toFixed(2);
					var figure = ''+ num + ' B';
					$('#braincontrol-holder #page-markets #dashboard-cap .figure').text(figure);
					stats['cap'] = figure;
					if(count == 6) base.set('stats', stats);
				});
				braincontrol.unload();
			}
			else
			{
				count = 0;
				now = new Date().getTime();
				$('#braincontrol-holder #page-markets #dashboard-usd .figure').text(stats.price);
				$('#braincontrol-holder #page-markets #dashboard-24tx .figure').text(stats.transactions);
				$('#braincontrol-holder #page-markets #dashboard-24sent .figure').text(stats.sent);
				$('#braincontrol-holder #page-markets #dashboard-hash .figure').text(stats.hash);
				$('#braincontrol-holder #page-markets #dashboard-found .figure').text(stats.found);
				$('#braincontrol-holder #page-markets #dashboard-cap .figure').text(stats.cap);
				braincontrol.unload();
			}
		}
		braincontrol.unload();
	}

	// FORM ADD-ONS
	this.forms = function(options)
	{
		$('#'+options.id).find('.form-group').each(function()
		{
			$(this).find('label').on('click', function(e){
				e.preventDefault();
				if($(this).parent().find('.fa').length > 0)
				{
					$(this).parent().find('.fa').trigger('click');
				}
				$(this).parent().find('input').trigger('focus');
			});
		})
	}

	// SETUP SEQUENCE
	this.setup = function(options)
	{

		$('#'+options.id).addClass('brain_loading');

		braincontrol.template('base', false, function(html)
		{
			$('#'+options.id).html(html);
			$('#'+options.id).prepend('<h1 id="loading-text">'+options.ux.buttons.loading+'</h1>');
			if(base.really_compatible() === false)
			{
				var accounts = false;
			}
			else
			{
				var accounts = base.get('accounts');
				if(accounts)
				{
					$.each(accounts, function(k, v)
					{
						$('#braincontrol #page-send select#from').prepend('<option value="'+v.username+'">'+v.label+'</option>')
					})
				}
			}
			
			buttons.defaults(options);
			braincontrol.dashboard();
			braincontrol.forms(options);

			var canvas_height = $('#'+options.id).height();

			$('#'+options.id).css({'height':canvas_height});

			$('#braincontrol .bc-panel').each(function(i){

				var canvas_width = $('#'+options.id).width();

				var header_height = $(this).find('.step-top').height() + 30;
				var footer_height = $(this).find('.step-bottom').height() + 30;
				var middle_height = canvas_height - ((header_height + footer_height) + 10);
				var inner_height = $(this).find('.step-middle').height();

				if(inner_height > middle_height) $(this).find('.step-middle .unessential').hide(0, function(i){
					if($(this).attr('id') == 'salt') $(this).parent().hide();
				});

				$(this).find('.step-middle').css({height:middle_height, width:canvas_width});

			});

			$('#braincontrol #pages .page').each(function(i){

				var id = $(this).attr('id');
				var middle_height = $(this).parent().height();

				if(id == 'page-markets')
				{
					$(this).find('.stat').each(function(i){
						var height = (($('#braincontrol-holder #page-markets').height() - 110) / 100) * 33.3;
						$(this).height(height);
					})
				}

				$(this).find('form').each(function(i){
					var this_form = $(this);
					var inner_height = $(this).height();
					if(inner_height > middle_height)
					{
						$(this).find('.unessential').hide(0, function(i){
							if($(this).attr('id') == 'salt')
							{
								$(this).parent().hide();
							}
							$(this_form).css({'margin-top':-127});
						});
					}
				});
			});

			if(accounts)
			{
				braincontrol.slide(false, 'page-markets');
			}
			else
			{
				braincontrol.slide('down', 'step-setup');
			}

			$('#'+options.id).transition({'opacity':1}, 350, function(i){
				braincontrol.unload();
			})
		});
	}

	this.init = function()
	{
		var settings = braincontrol.start(config.defaults());
		var wrapper = $('#'+settings.id);
		if($(wrapper).length > 0)
		{
			braincontrol.setup(settings);
		}
		else
		{
			base.alert(base.lang('Cannot find associated ID'));
		}
	}
}

$(window).load(function(e)
{
	braincontrol.init();
});