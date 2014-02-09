buttons = new function(){

	this.defaults = function(options)
	{
		$('#'+options.id).on('click', '.fake-input', function(e){
			this.setSelectionRange(0, 9999);
			e.preventDefault();
			e.stopPropagation();
		});
		$('#'+options.id).on('click', '#bc-recover-account', function(e){
			e.preventDefault();
			$('#'+options.id).find('#step-recover .bc-form #name').val('');
			$('#'+options.id).find('#step-recover .bc-form #password').val('');
			$('#'+options.id).find('#step-recover .bc-form #password_repeat').val('');
			$('#'+options.id).find('#step-recover .bc-form #salt').val('');
			$('#'+options.id).find('#step-recover .bc-form #url').val('');
			$('#'+options.id).find('#step-recover .bc-form #pin').val('');
		});
		$('#'+options.id).on('click', '#bc-new-wallet', function(e){
			e.preventDefault();
			$('#'+options.id).find('#step-new .bc-form #name').val('');
			$('#'+options.id).find('#step-new .bc-form #password').val('');
			$('#'+options.id).find('#step-new .bc-form #password_repeat').val('');
			$('#'+options.id).find('#step-new .bc-form #pin').val('');
		});
		$('#'+options.id).on('click', '#bc-new-contact', function(e){
			e.preventDefault();
			$('#'+options.id).find('#step-contact .bc-form #name').val('');
			$('#'+options.id).find('#step-contact .bc-form #address').val('');
			$('#'+options.id).find('#step-contact .bc-form #tel').val('');
			$('#'+options.id).find('#step-contact .bc-form #email').val('');
			$('#'+options.id).find('#step-contact .bc-form #notes').val('');
		});
		$('#'+options.id).on('click', '#bc-import-keys', function(e){
			e.preventDefault();
			$('#'+options.id).find('#step-import .bc-form #name').val('');
			$('#'+options.id).find('#step-import .bc-form #password').val('');
			$('#'+options.id).find('#step-import .bc-form #password_repeat').val('');
			$('#'+options.id).find('#step-import .bc-form #key').val('');
			$('#'+options.id).find('#step-import .bc-form #pin').val('');
		});
		$('#'+options.id).on('click', '#step-confirm-send .bc-submit', function(e){
			e.preventDefault();
			braincontrol.load();
			var typed_password = $('#'+options.id).find('#step-confirm-send .bc-form #password').val();
			var typed_salt = $('#'+options.id).find('#step-confirm-send .bc-form #salt').val();
			var typed_pin = $('#'+options.id).find('#step-confirm-send .bc-form #pin').val();
			$('#'+options.id).find('#page-send .bc-form #password').val(typed_password);
			$('#'+options.id).find('#page-send .bc-form #salt').val(typed_salt);
			$('#'+options.id).find('#page-send .bc-form #pin').val(typed_pin);
			braincontrol.slide(false, 'page-send', function()
			{
				var form = $('#'+options.id).find('#page-send .bc-form');
				var data = new Object();
				$(form).find('input, select, textarea').each(function(i)
				{
					data[$(this).attr('id')] = $(this).val();
				});
				if(data.to)
				{
					var accounts = base.get('accounts');
					var account = accounts[data.from];
					var username = account.username;
					var original_balance = parseFloat(account.btc) * 100000000;
					if(account.address) data.from = account.address;
				}
				if(data.from && !btc.validate(data.from)) base.alert(base.lang('Valid Address Required'));
				else if(!data.to) base.alert(base.lang('To Address Required'));
				else if(!data.salt) base.alert(base.lang('Missing Salts'));
				else if(!data.password) base.alert(base.lang('Password Required'));
				else if(!data.from) base.alert(base.lang('From Address Required'));
				else if(!data.fee || parseFloat(data.fee) < 0.0001) base.alert(base.lang('Minimum 0.0001 Fee Required'));
				else if(!data.amount || parseFloat(data.amount) < 0.000001) base.alert(base.lang('Minimum 0.000001 Transaction Required'));
				if(!data.to || !data.password || !data.from || !data.fee || parseFloat(data.fee) < 0.0001 || !data.amount || parseFloat(data.amount) < 0.000001)
				{
					braincontrol.unload();
					return false;
				}
				else
				{
					if(Crypto.SHA256(data.password) != account.pw)
					{
						base.alert(base.lang('Password Mismatch!'));
						braincontrol.unload();
						return false;
					}
					else if(Crypto.SHA256(data.salt) != account.salt)
					{
						base.alert(base.lang('Salt Mismatch!'));
						braincontrol.unload();
						return false;
					}
					else if(Crypto.SHA256(data.pin) != account.pin)
					{
						base.alert(base.lang('Pin Mismatch!'));
						braincontrol.unload();
						return false;
					}

					var saved_url = base.get('url');
					if(account.url) saved_url = account.url;

					var keys = btc.keys(Crypto.SHA256(data.salt+saved_url+Crypto.SHA256(username+data.password+data.pin)));
					var this_address = keys.pubkey.toString();
					if(this_address != account.address)
					{
						base.alert(base.lang('Unknown error!'));
						braincontrol.unload();
					}
					else
					{
						btc.unspent(account.address, function(results)
						{
							var satoshis_fee = parseFloat(data.fee) * 100000000;
							var satoshis_requested = parseFloat(data.amount) * 100000000;
							var satoshis_available = 0;
							var these_inputs = [];
							var these_outputs = [];
							these_outputs.push({'address':data.to,'value':data.amount});
							$.each(results, function(i, obj){
								if(!obj['tx_hash'])
								{
									satoshis_available+= parseFloat(obj['out'][obj['in'][0].prev_out.n].value);
									these_inputs.push({
										'txid': obj.hash,
										'n': obj['in'][0].prev_out.n,
										'value': parseFloat(obj['out'][obj['in'][0].prev_out.n].value),
										'script': obj['in'][0].scriptSig
									});
								}
								else
								{
									satoshis_available+= parseFloat(obj.value);
									these_inputs.push({
										'txid': base.endian(obj.tx_hash),
										'n': obj.tx_output_n,
										'value': parseFloat(obj.value),
										'script': obj.script
									});
								}
							});
							if(satoshis_requested > (satoshis_available + satoshis_fee))
							{
								base.alert(base.lang('Not enough balance - have reduced to max - please re-confirm'));
								braincontrol.unload();
								var max_satoshis = satoshis_available - satoshis_fee;
								$('#'+options.id).find('#page-send #amount').val(parseFloat(max_satoshis / 100000000));
							}
							else
							{
								var raw_transaction = btc.raw(this_address, keys.privkey.toString(), these_inputs, these_outputs, satoshis_fee, satoshis_requested);
								$.ajax({
									url: 'https://blockchain.info/pushtx',
									data: {
										tx: raw_transaction
									},
									dataType: 'TEXT',
									type: 'POST',
									complete: function(results)
									{
										blockchain.balance(keys.pubkey.toString(), function(results)
										{
											var new_balance = parseInt(results);
											braincontrol.unload();
											if(new_balance != original_balance)
											{
												var new_amount = parseFloat(new_balance / 100000000);
												accounts[username].btc = new_amount;
												$('#'+options.id).find('.btc').each(function(i)
												{
													if($(this).attr('data-username') == username)
													{
														$(this).text(new_amount);
													}
												})
												base.set('accounts', accounts);
												base.alert(base.lang('Successfully sent'));
												braincontrol.slide(false, 'page-accounts');
											}
											else
											{
												base.alert(base.lang('Unable to send - may have been connection issues, please try again.'));
											}
										});
									}
								})
							}
						})
					}
				}
			})
		});
		$('#'+options.id).on('click', '.bc-submit', function(e){
			e.preventDefault();

			var button = $(this);
			var salt = base.get('salt');
			var form = $(this).parent().parent().find('form.bc-form');
			if($(this).parent().parent().hasClass('bc-form')) form = $(this).parent().parent();
			var data = new Object();

			$(form).find('input, select, textarea').each(function(i)
			{
				data[$(this).attr('id')] = $(this).val();
			});

			if(data.type == 'send_payment')
			{
				if(!data.to) base.alert(base.lang('To Address Required'));
				else if(!data.from) base.alert(base.lang('From Address Required'));
				else if(!data.fee || parseFloat(data.fee) < 0.0001) base.alert(base.lang('Minimum 0.0001 Fee Required'));
				else if(!data.amount || parseFloat(data.amount) < 0.000001) base.alert(base.lang('Minimum 0.000001 Transaction Required'));
				if(!data.to || !data.from || !data.fee || parseFloat(data.fee) < 0.0001 || !data.amount || parseFloat(data.amount) < 0.000001)
				{
					return false;
				}
				else
				{
					var stats = base.get('stats');
					var price = parseFloat(stats['price']);
					var value = parseFloat(data.amount * price).toFixed(2);
					var fees = parseFloat(data.fee * price).toFixed(2);
					$('#'+options.id).find('#step-confirm-send .bc-form .unessential .btc').text(data.amount);
					$('#'+options.id).find('#step-confirm-send .bc-form .unessential .usd').text(value);
					$('#'+options.id).find('#step-confirm-send .bc-form .unessential .fee').text(fees);
					$('#'+options.id).find('#step-confirm-send .bc-form #password').val('');
					$('#'+options.id).find('#step-confirm-send .bc-form #salt').val(salt);
					$('#'+options.id).find('#step-confirm-send .bc-form #pin').val('');
					braincontrol.slide('down', 'step-confirm-send', function(data){

					});
				}
			}
			else if(data.type == 'new_id' || data.type == 'import_keys' || data.type == 'recover_accounts')
			{
				var url_salt = false;
				var saved_salt = base.get('salt');
				var saved_url = base.get('url');
				if(!window.location) url_salt = 'https://braincontrol.me';
				else if(!saved_url && window.location.href) url_salt = window.location.href.substring(0, window.location.href.length - window.location.search.length);
				else if(!saved_url && !window.location.href) url_salt = 'https://braincontrol.me';
				else if(saved_url) url_salt = saved_url;
				if(data.type == 'import_keys' && !data.salt && saved_salt) data.salt = saved_salt;
				else if(data.type == 'import_keys' && !saved_salt)
				{
					base.alert(base.lang('Cannot Import - Device Salt not Set!'))
					return false;
				}
				if(data.type == 'recover_accounts' && !data.url) base.alert(base.lang('Base URL Required'));
				else if(data.type == 'import_keys' && !data.key) base.alert(base.lang('Private Key Required'));
				else if(!data.salt) base.alert(base.lang('Salt Required'));
				else if(!data.name) base.alert(base.lang('Name Required'));
				else if(!data.password) base.alert(base.lang('Password Required'));
				else if(!data.password_repeat) base.alert(base.lang('Password Mismatch'));
				else if(data.password && data.password_repeat && data.password != data.password_repeat) base.alert(base.lang('Password Mismatch'));
				if(!data.salt || !data.name || !data.password || data.password != data.password_repeat || (data.type == 'import_keys' && !data.key) || (data.type == 'recover_keys' && !data.url))
				{
					return false;
				}
				else if(data.password && data.password.length < 15 && confirm(base.lang('We recommend that your passphrase be 15 characters or more - click cancel to ignore this warning or OK to provide a stronger passphrase.'), function(){ return true; }))
				{
					return false;
				}
				else
				{
					var name = data.name.replace(/\W/g, '');
					var username = name.toLowerCase();
					var wallets = base.get('accounts');
					if(wallets && wallets[username])
					{
						base.alert(base.lang('This User Already Exists!'));
					}
					else
					{
						var keys;
						var address;
						if(data.type == 'import_keys' && data.key)
						{
							braincontrol.load();
							address = btc.convert(data.key);
							blockchain.balance(address, function(results)
							{
								var satoshi_balance = parseInt(results);
								var balance = parseFloat(parseInt(results) / 100000000);
								if(balance < 0.00011) base.alert(base.lang('No Bitcoin to Import'));
								else
								{
									if(data.url) keys = btc.keys(Crypto.SHA256(data.salt+data.url+Crypto.SHA256(username+data.password+data.pin)));
									else keys = btc.keys(Crypto.SHA256(data.salt+url_salt+Crypto.SHA256(username+data.password+data.pin)));
									var address_to_send_to = keys.pubkey.toString();
									btc.unspent(address, function(results)
									{
										var satoshis_fee = parseFloat(0.0001) * 100000000;
										var satoshis_requested = satoshi_balance - satoshis_fee;
										var satoshis_available = 0;
										var these_inputs = [];
										var these_outputs = [];
										these_outputs.push({'address':address_to_send_to,'value':balance - 0.0001});
										$.each(results, function(i, obj){
											if(!obj['tx_hash'])
											{
												satoshis_available+= parseFloat(obj['out'][obj['in'][0].prev_out.n].value);
												these_inputs.push({
													'txid': obj.hash,
													'n': obj['in'][0].prev_out.n,
													'value': parseFloat(obj['out'][obj['in'][0].prev_out.n].value),
													'script': obj['in'][0].scriptSig
												});
											}
											else
											{
												satoshis_available+= parseFloat(obj.value);
												these_inputs.push({
													'txid': base.endian(obj.tx_hash),
													'n': obj.tx_output_n,
													'value': parseFloat(obj.value),
													'script': obj.script
												});
											}
										});
										var raw_transaction = btc.raw(address, data.key, these_inputs, these_outputs, satoshis_fee, satoshis_requested);
										$.ajax({
											url: 'https://blockchain.info/pushtx',
											data: {
												tx: raw_transaction
											},
											dataType: 'TEXT',
											type: 'POST',
											complete: function(results)
											{
												blockchain.balance(address_to_send_to, function(results)
												{
													var new_balance = parseInt(results);
													braincontrol.unload();
													if(new_balance > 0)
													{
														var new_amount = parseFloat(new_balance / 100000000);
														if(!wallets) var wallet = new Object();
														else wallet = wallets;
														wallet[username] = {
															pw: Crypto.SHA256(data.password),
															salt: Crypto.SHA256(data.salt),
															pin: Crypto.SHA256(data.pin),
															currency: 'btc',
															btc: new_amount,
															ts: new Date().getTime(),
															address: address_to_send_to,
															label: data.name,
															username: username
														};
														if(data.url) wallet[username].url = data.url;
														var data_for_template = wallet[username];
														data_for_template['button_backup'] = base.lang('Backup');
														data_for_template['button_clear'] = base.lang('Clear');
														data_for_template['button_qr'] = base.lang('QR');
														base.set('accounts', wallet);
														braincontrol.slide(false, 'page-accounts');
														braincontrol.template('accounts', data_for_template, function(html)
														{
															$('#braincontrol-holder select#from').append('<option value="'+username+'">'+data.name+'</option>');
															$('#braincontrol-holder #page-accounts').prepend(html);
															$('#braincontrol-holder #page-accounts').find('.bc-via-ajax').show(350, function(i){
																$(this).removeClass('bc-via-ajax');
																braincontrol.unload();
															});
														});
													}
													else
													{
														base.alert(base.lang('Unable to send - may have been connection issues, please try again.'));
													}
												});
											}
										})
									});
								}
							});
						}
						else
						{
							if(data.url) keys = btc.keys(Crypto.SHA256(data.salt+data.url+Crypto.SHA256(username+data.password+data.pin)));
							else keys = btc.keys(Crypto.SHA256(data.salt+url_salt+Crypto.SHA256(username+data.password+data.pin)));
							address = keys.pubkey.toString();
							if(keys && address)
							{
								braincontrol.load();
								blockchain.balance(address, function(results)
								{
									if(!wallets) var wallet = new Object();
									else wallet = wallets;
									var balance = parseFloat(parseInt(results) / 100000000);
									wallet[username] = {
										pw: Crypto.SHA256(data.password),
										salt: Crypto.SHA256(data.salt),
										pin: Crypto.SHA256(data.pin),
										currency: 'btc',
										btc: balance,
										ts: new Date().getTime(),
										address: address,
										label: data.name,
										username: username
									};
									if(data.url) wallet[username].url = data.url;
									var data_for_template = wallet[username];
									data_for_template['button_backup'] = base.lang('Backup');
									data_for_template['button_clear'] = base.lang('Clear');
									data_for_template['button_qr'] = base.lang('QR');

									if(!saved_salt)
									{
										base.set('salt', data.salt);
										$('#'+options.id).find('input#salt').val(data.salt);
									}
									if(!saved_url) base.set('url', url_salt);

									base.set('accounts', wallet);
									braincontrol.slide(false, 'page-accounts');
									braincontrol.template('accounts', data_for_template, function(html)
									{
										$('#braincontrol-holder select#from').append('<option value="'+username+'">'+data.name+'</option>');
										$('#braincontrol-holder #page-accounts').prepend(html);
										$('#braincontrol-holder #page-accounts').find('.bc-via-ajax').show(350, function(i){
											$(this).removeClass('bc-via-ajax');
											braincontrol.unload();
										});
									});
								})
							}
						}
					}
				}
			}
			else if(data.type == 'new_contact')
			{
				if(!data.name) base.alert(base.lang('Name Required'));
				else if(!data.address) base.alert(base.lang('Address Required'));
				if(!data.name || !data.address)
				{
					return false;
				}
				else
				{
					var name = data.name.replace(/\W/g, '');
					var username = name.toLowerCase();
					var contacts = base.get('contacts');
					if(contacts && contacts[username])
					{
						base.alert(base.lang('This Contact Already Exists!'));
					}
					else
					{
						if(!btc.validate(data.address))
						{
							base.alert(base.lang('Not a valid BTC Address!'));
							return false;
						}
						var got_contacts = 0;
						if(contacts) got_contacts = parseInt(contacts.length);
						if(contacts && got_contacts > 0)
						{
							var contact_count = 1;
							var contacts_count = contacts.length;
							$.each(contacts, function(k, v)
							{
								if(v.address == data.address)
								{
									base.alert(base.lang('This Address Already Exists!'));
									return false;
								}
								else if(contact_count == contacts_count)
								{
									braincontrol.load();
									if(!contacts) var contact = new Object();
									else contact = contacts;
									contact[username] = {
										name: data.name,
										address: data.address,
										username: username
									};
									if(data.tel) contact[username].tel = data.tel;
									if(data.email) contact[username].email = data.email;
									if(data.notes) contact[username].notes = data.notes;
									var data_for_template = contact[username];
									data_for_template['button_send'] = base.lang('Send');
									data_for_template['button_notes'] = base.lang('Notes');
									data_for_template['button_clear'] = base.lang('Clear');
									data_for_template['button_qr'] = base.lang('QR');
									base.set('contacts', contact);
									braincontrol.slide(false, 'page-contacts');
									braincontrol.template('contacts', data_for_template, function(html)
									{
										$('#braincontrol-holder #select-bc-select-contact').append('<option value="'+data.address+'">'+data.name+'</option>');
										$('#braincontrol-holder #page-contacts').prepend(html);
										$('#braincontrol-holder #page-contacts').find('.bc-via-ajax').show(350, function(i){
											$(this).removeClass('bc-via-ajax');
											braincontrol.unload();
										});
									});
								}
								contact_count++
							});
						}
						else
						{
							braincontrol.load();
							if(!contacts) var contact = new Object();
							else contact = contacts;
							contact[username] = {
								name: data.name,
								address: data.address,
								username: username
							};
							if(data.tel) contact[username].tel = data.tel;
							if(data.email) contact[username].email = data.email;
							if(data.notes) contact[username].notes = data.notes;
							var data_for_template = contact[username];
							data_for_template['button_send'] = base.lang('Send');
							data_for_template['button_notes'] = base.lang('Notes');
							data_for_template['button_clear'] = base.lang('Clear');
							data_for_template['button_qr'] = base.lang('QR');
							base.set('contacts', contact);
							braincontrol.slide(false, 'page-contacts');
							braincontrol.template('contacts', data_for_template, function(html)
							{
								$('#braincontrol-holder #select-bc-select-contact').append('<option value="'+data.address+'">'+data.name+'</option>');
								$('#braincontrol-holder #page-contacts').prepend(html);
								$('#braincontrol-holder #page-contacts').find('.bc-via-ajax').show(350, function(i){
									$(this).removeClass('bc-via-ajax');
									braincontrol.unload();
								});
							});
						}
					}
				}
			}
		});
		$('#'+options.id).on('click', '.bc-button', function(e){
			if(!$(this).hasClass('bc-link')) e.preventDefault();
			else $(this).attr('target','_blank');
		});
		$('#'+options.id).on('click', 'ul.keypad li a', function(e){
			e.preventDefault();
			var is_pin = true;
			var button = $(this);
			var this_value = $(this).text();
			var input = $(this).parent().parent().parent().find('input.label-less');
			var current_val = $(input).val();
			var digit_count = current_val.length;
			if($(this).parent().parent().hasClass('calculator')) is_pin = false;
			if((is_pin && this_value != 'Del' && this_value != 'OK') || (!is_pin && this_value != 'Del' && this_value != 'BTC' && this_value != 'USD' && this_value != 'ENT' && this_value != '+' && this_value != '-' && this_value != '.'))
			{
				if(digit_count < 6 ||(digit_count < 10 && !is_pin))
				{
					$(this).parent().parent().parent().find('input.label-less').val('' + current_val + this_value + '');
				}
				if(digit_count === 5 && is_pin)
				{
					var id = $('#step-pin .fancy-title a.fa').attr('data-id');
					$('#'+id+' form.bc-form .pin_number').val('' + current_val + this_value + '');
					$(this).parent().parent().parent().parent().parent().find('.step-top .fancy-title a.fa').trigger('click');
				}
			}
			else if(this_value == '+')
			{
				base.set('calc_plus', current_val);
				$(this).parent().parent().parent().find('input.label-less').val('');
				$('#'+options.id).find('ul.keypad.calculator li.enter').attr('data-type', 'calc_plus');
			}
			else if(this_value == '-')
			{
				base.set('calc_minus', current_val);
				$(this).parent().parent().parent().find('input.label-less').val('');
				$('#'+options.id).find('ul.keypad.calculator li.enter').attr('data-type', 'calc_minus');
			}
			else if(this_value == '.')
			{
				if(current_val.indexOf('.') === -1)
				{
					$(this).parent().parent().parent().find('input.label-less').val('' + current_val + '.');
				}
			}
			else if(this_value == 'ENT')
			{
				var this_selection = $('#'+options.id).find('ul.keypad.calculator li.enter').attr('data-type');
				if(this_selection == 'calc_plus')
				{
					//var new_value = parseFloat(current_val) + parseFloat(base.get('calc_plus'));
					$(this).parent().parent().parent().find('input.label-less').val(parseFloat(current_val) + parseFloat(base.get('calc_plus')));
					base.get('calc_plus', null);
					base.get('calc_minus', null);
					$('#'+options.id).find('ul.keypad.calculator li.enter').attr('data-type', '');
				}
				else if(this_selection == 'calc_minus')
				{
					$(this).parent().parent().parent().find('input.label-less').val(parseFloat(base.get('calc_minus')) - parseFloat(current_val));
					base.get('calc_plus', null);
					base.get('calc_minus', null);
					$('#'+options.id).find('ul.keypad.calculator li.enter').attr('data-type', '');
				}
			}
			else if(this_value == 'Del')
			{
				$(this).parent().parent().parent().find('input.label-less').val('' + current_val.slice(0, -1) + '');
			}
			else if(this_value == 'OK')
			{
				if(digit_count === 6)
				{
					var id = $('#step-pin .fancy-title a.fa').attr('data-id');
					$('#'+id+' form.bc-form .pin_number').val('' + current_val + this_value + '');
					$(this).parent().parent().parent().parent().parent().find('.step-top .fancy-title a.fa').trigger('click');
				}
				else
				{
					alert(base.lang('6 Digits Required'));
				}
			}
			else if(this_value == 'BTC')
			{
				var val = 0;
				if($(input).val()) val = $(input).val();
				if(val)
				{
					var usd_price = 1 / parseFloat(base.get('stats').price);
					var btc_value = parseFloat(val);
					var btc_amount = parseFloat(usd_price * btc_value).toFixed(8);
					$(input).val(btc_amount);
				}
				$(button).text('USD');
				$(input).attr('placeholder', base.lang('Convert from BTC to USD'));
			}
			else if(this_value == 'USD')
			{
				var val = 0;
				if($(input).val()) val = $(input).val();
				if(val)
				{
					var btc_price = parseFloat(base.get('stats').price);
					var usd_value = parseFloat(val);
					var usd_amount = parseFloat(btc_price * usd_value).toFixed(2);
					$(input).val(usd_amount);
				}
				$(button).text('BTC');
				$(input).attr('placeholder', base.lang('Convert from USD to BTC'));
			}
		});
		$('#'+options.id).on('click', '.bc-button.bc-pin', function(e){
			e.preventDefault();
			var back_direction = $(this).attr('data-back-direction');
			var back_id = $(this).attr('data-back-id');
			$('#step-pin .fancy-title a.fa').attr('data-direction', back_direction);
			$('#step-pin .fancy-title a.fa').attr('data-id', back_id);
		});
		$('#'+options.id).on('click', '#step-notes .fancy-title .fa', function(e){
			var form = $(this).parent().parent().parent().find('form');
			var email = $(form).find('#email').val();
			var tel = $(form).find('#tel').val();
			var notes = $(form).find('#notes').val();
			$('#step-contact').find('form #email').val(email);
			$('#step-contact').find('form #tel').val(tel);
			$('#step-contact').find('form #notes').val(notes);
		});
		$('#'+options.id).on('click', '.bc-button.bc-notes', function(e){
			e.preventDefault();
			var back_direction = $(this).attr('data-back-direction');
			var back_id = $(this).attr('data-back-id');
			$('#step-notes .fancy-title a.fa').attr('data-direction', back_direction);
			$('#step-notes .fancy-title a.fa').attr('data-id', back_id);
		});
		$('#'+options.id).on('click', '#bc-new-wallet', function(e){
			e.preventDefault();
			$('#step-new .bc-pin.bc-button').attr('data-back-id', 'step-new');
			$('#step-new .fancy-title a.fa').attr('data-direction', '');
			$('#step-new .fancy-title a.fa').attr('data-id', $(this).attr('data-back-id'));
		});
		$('#'+options.id).on('click', '#bc-new-contact', function(e){
			e.preventDefault();
			$('#step-notes .bc-form #email').val('');
			$('#step-notes .bc-form #tel').val('');
			$('#step-notes .bc-form #notes').val('');
			$('#step-contact .bc-pin.bc-button').attr('data-back-id', 'step-contact');
			$('#step-contact .fancy-title a.fa').attr('data-direction', '');
			$('#step-contact .fancy-title a.fa').attr('data-id', $(this).attr('data-back-id'));
		});
		$('#'+options.id).on('click', '#bc-reset-device', function(e){
			e.preventDefault();
			if(confirm(base.lang('Confirm device reset?')))
			{
				base.reset();
				location.reload();
				/*
				basket
				.remove('js/base.js')
				.remove('js/blockchain.js')
				.remove('js/btc.js')
				.remove('js/buttons.js')
				.remove('js/braincontrol.js');
				*/
			}
			else
			{
				base.set('templates', null);
				/*
				basket
				.remove('js/base.js')
				.remove('js/blockchain.js')
				.remove('js/btc.js')
				.remove('js/buttons.js')
				.remove('js/braincontrol.js');
				*/
			}
		});
		$('#'+options.id).on('click', '#navigation a', function(e){
			e.preventDefault();
			if($(this).attr('data-id') == 'page-accounts')
			{
				blockchain.balances(0);
			}
		});
		$('#'+options.id).on('click', '.bc-slide', function(e){
			e.preventDefault();
			if(!$(this).hasClass('active'))
			{
				if($(this).parent().attr('id') == 'navigation')
				{
					$('#braincontrol #navigation a.bc-slide').removeClass('active');
					$(this).addClass('active');
				}
				else if($(this).find('.fa-bc-calculator').length > 0)
				{
					$('#step-calculator input#usd-to-btc').val('');
					$('#step-calculator .fancy-title a.fa').attr('data-id', $('#navigation a.active').attr('data-id'));
				}
				else if($(this).find('.fa-bc-profile').length > 0)
				{
					$('#step-profile .fancy-title a.fa').attr('data-id', $('#navigation a.active').attr('data-id'));
				}
				braincontrol.slide($(this).attr('data-direction'), $(this).attr('data-id'), $(this).attr('data-return'));
			}
		});
		$('#'+options.id).on('click', '.bc-account-backup', function(e){
			e.preventDefault();
			var username = $(this).attr('data-username');
			var accounts = base.get('accounts');
			var salt = base.get('salt');
			var account = accounts[username];
			$('#'+options.id).find('#step-confirm input#username').val(username);
			$('#'+options.id).find('#step-confirm input#password').val('');
			$('#'+options.id).find('#step-confirm input#pin').val('');
			if(account.pin && account.pin != 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')
			{
				$('#'+options.id).find('#step-confirm a.bc-pin').removeClass('invisible');
			}
			else
			{
				$('#'+options.id).find('#step-confirm a.bc-pin').addClass('invisible');
			}
			if(account.salt && account.salt == Crypto.SHA256(salt))
			{
				$('#'+options.id).find('#step-confirm input#salt').parent().hide();
			}
			else
			{
				$('#'+options.id).find('#step-confirm input#salt').parent().show();
				$('#'+options.id).find('#step-confirm input#salt').val();
			}
			braincontrol.slide('up', 'step-confirm', function(e)
			{
				
			})
		});
		$('#'+options.id).on('click', '#step-qr-backups .fancy-title .fa', function(e)
		{
			$('#'+options.id).find('#step-qr-backups .qr_code_title').html('');
			$('#'+options.id).find('#step-qr-backups .qr_code img').attr('src', '');
		});
		$('#'+options.id).on('click', '.bc-account-clear', function(e){
			e.preventDefault();
			var accounts = base.get('accounts');
			var username = $(this).attr('data-username');
			var wrapper = $(this).parent().parent();
			if(confirm(base.lang('Please re-confirm that you want to remove this account before it is gone for good.')))
			{
				$(wrapper).hide(350, function(e){
					$(this).remove();
					delete accounts[username];
					$('#braincontrol-holder #send-payment select#from option').each(function(i)
					{
						if($(this).attr('value') == username) $(this).remove();
					})
					base.set('accounts', accounts);
				})
			}
		});
		$('#'+options.id).on('click', '.bc-contact-clear', function(e){
			e.preventDefault();
			var contacts = base.get('contacts');
			var username = $(this).attr('data-username');
			var address = $(this).attr('data-address');
			var wrapper = $(this).parent().parent();
			if(confirm(base.lang('Please re-confirm that you want to remove this contact before it is gone for good.')))
			{
				$(wrapper).hide(350, function(e){
					$(this).remove();
					delete contacts[username];
					$('#braincontrol-holder #send-payment select#select-bc-select-contact option').each(function(i)
					{
						if($(this).attr('value') == address) $(this).remove();
					})
					base.set('contacts', contacts);
				})
			}
		});
		$('#'+options.id).on('click', '.bc-account-qr', function(e){
			e.preventDefault();
			var qrCode = qr_code.qrcode(3, 'L');
			var address = $(this).attr('data-address');
			var text = address.replace(/^[\s\u3000]+|[\s\u3000]+$/g, '');
			qrCode.addData(text);
			qrCode.make();
			$('#braincontrol #step-qr-accounts .qr_code_title').text(address);
			$('#braincontrol #step-qr-accounts .qr_code').html(qrCode.createImgTag(4));
		});
		$('#'+options.id).on('click', '.bc-contact-qr', function(e){
			e.preventDefault();
			var qrCode_contact = qr_code.qrcode(3, 'L');
			var address = $(this).attr('data-address');
			var text = address.replace(/^[\s\u3000]+|[\s\u3000]+$/g, '');
			qrCode_contact.addData(text);
			qrCode_contact.make();
			$('#braincontrol #step-qr-contacts .qr_code_title').text(address);
			$('#braincontrol #step-qr-contacts .qr_code').html(qrCode_contact.createImgTag(4));
		});
		$('#'+options.id).on('click', '.bc-contact-notes', function(e){
			e.preventDefault();
			var username = $(this).attr('data-username');
			if($(this).hasClass('empty'))
			{
				$('#'+options.id).find('#step-note .bc-submit').attr('data-username', username);
			}
			else
			{
				var contacts = base.get('contacts');
				var contact = contacts[username];
				$('#'+options.id).find('#step-note .bc-submit').attr('data-username', username);
				if(contact)
				{
					if(contact.tel) $('#'+options.id).find('.bc-form #tel').val(contact.tel);
					if(contact.email) $('#'+options.id).find('.bc-form #email').val(contact.email);
					if(contact.notes) $('#'+options.id).find('.bc-form #notes').val(contact.notes);
				}
			}
		});
		$('#'+options.id).on('click', '#bc-select-contact', function(e){
			e.preventDefault();
			var $this = $(this);
			$(this).hide();
			$(this).parent().find('input').hide(350, function(){

			})
			$(this).parent().find('.hidden-select').show(350, function(){
				$(this).on('change, select, blur', function(e){
					$($this).show();
					$($this).parent().find('.hidden-select').hide(350, function(e)
					{

					});
					$($this).parent().find('input').val($(this).val()).show(350, function(e)
					{

					});
				})
			})
		});
		$('#'+options.id).on('click', '.bc-edit-notes', function(e){
			e.preventDefault();
			var $this = $(this);
			var form = $('#'+options.id).find('#step-note input, #step-note textarea, #step-note label').each(function(i)
			{
				$(this).removeAttr('readonly');
			})
		});
		$('#'+options.id).on('click', '#step-profile #qr-scan-code', function(e){
			e.preventDefault();
			var input = $(this).parent().find('input.qr-scan');

			if(typeof MozActivity == 'function')
			{
				var recordActivity = new MozActivity({ name: "record" });
				recordActivity.onsuccess = function ()
				{
					var src = window.URL.createObjectURL(this.result.blob);
					qrcode.callback = function(decoded_message)
					{
						alert('QR Code = '+decoded_message);
					}
					qrcode.decode(reader.result);
				}
			}
			else
			{
				$(input).trigger('click');
			}
		});
		$('#'+options.id).on('change', '#step-profile input.qr-scan', function(e){
			$(this).hide();
			var file = e.target.files[0];
			try{
				var reader = new FileReader();
				reader.onloadend = function(e) {
					qrcode.callback = function(decoded_message)
					{
						alert('QR Code = '+decoded_message);
					}
					qrcode.decode(reader.result);
				}
				reader.readAsDataURL(file);
			}catch(e){
				base.alert(base.lang('This device does not support the HTML5 File Reader'));
			}
		});
		$('#'+options.id).on('click', '.print-key', function(e)
		{
			e.preventDefault();
			$('#'+options.id).find('.bc-panel').removeClass('printing');
			$('#'+options.id).find('#'+$(this).attr('data-id')).addClass('printing');
			window.print();
		});
		$('#'+options.id).on('click', '.fancy-title .fa.fa-print', function(e)
		{
			e.preventDefault();
			$(this).parent().parent().parent().find('.step-middle .bc-button.bc-action').trigger('click');
		});
		$('#'+options.id).on('click', '.bc-contact-send', function(e)
		{
			e.preventDefault();
			var address = $(this).attr('data-address');
			$('#'+options.id).find('#page-send .bc-form #to').val(address);
			braincontrol.slide(false, 'page-send');
		});
		$('#'+options.id).on('click', '.form-group .fa-info-circle', function(e)
		{
			e.preventDefault();
			var $this = $(this);
			var this_value = $($this).parent().find('input').val();
			var type = $(this).prev().attr('for');
			var original_value = $($this).attr('data-original');
			if(!original_value)
			{
				$($this).attr('data-original', this_value);
				original_value = this_value;
			}
			if(type)
			{
				if(type == 'salt')
				{

					if(confirm(options.ux.info[type] + base.lang(' Click OK to proceed with the default salt, or should you require something extra secure and do not have a salt of your own you can use, click cancel, and a random salt will be generated. Very secure, but also difficult to recover if you do not backup your private keys AND the salt itself, which if different to the device default is also required in order to backup the keys - so copy it to clipboard if randomly generating!')))
					{
						if(this_value != original_value)
						{
							$($this).parent().find('input').val(original_value);
						}
					}
					else
					{
						var random_value = Crypto.SHA256(window.location.href + '_' + new Date().getTime())
						$($this).parent().find('input').val(random_value.slice(0, 12));
					}
				}
				else if(options.ux.info[type])
				{
					base.alert(options.ux.info[type])
				}
				else
				{
					base.alert(base.lang('Unknown info type'));
				}
			}
		});
		$('#'+options.id).on('click', '#step-note .bc-submit', function(e){
			e.preventDefault();
			var email = $('#'+options.id).find('#step-note #email').val();
			var tel = $('#'+options.id).find('#step-note #tel').val();
			var notes = $('#'+options.id).find('#step-note #notes').val();
			var username = $(this).attr('data-username');
			var contacts = base.get('contacts');
			if(email) contacts[username].email = email;
			if(tel) contacts[username].tel = tel;
			if(notes) contacts[username].notes = notes;
			if(email || tel || notes)
			{
				base.set('contacts', contacts);
				$('#'+options.id).find('#step-note .fancy-title a.fa').trigger('click');
			}
		});
		$('#'+options.id).on('click', '#step-confirm .bc-submit', function(e){
			e.preventDefault();
			var password = $('#step-confirm form.bc-form #password').val();
			var salt = $('#step-confirm form.bc-form #salt').val();
			var pin = $('#step-confirm form.bc-form #pin').val();
			var username = $('#step-confirm form.bc-form #username').val();
			if(username)
			{
				var url_salt = base.get('url');
				var accounts = base.get('accounts');
				var account = accounts[username];
				var saved_pw = account.pw;
				var saved_salt = account.salt;
				var saved_pin = account.pin;
				var saved_address = account.address;

				if(!pin) pin = '';
				if(!password) base.alert(base.lang('Password Required!'));
				else if(saved_pw != Crypto.SHA256(password)) base.alert(base.lang('Password Mismatch!'));
				else if(saved_salt != Crypto.SHA256(salt)) base.alert(base.lang('Salt Mismatch!'));
				else if(saved_pin != Crypto.SHA256(pin)) base.alert(base.lang('Pin Mismatch!'));
				if(!password || saved_pw != Crypto.SHA256(password) || saved_salt != Crypto.SHA256(salt) || saved_pin != Crypto.SHA256(pin))
				{
					return false;
				}
				else
				{
					braincontrol.load();
					if(account.url) url_salt = account.url;
					var keys = btc.keys(Crypto.SHA256(salt+url_salt+Crypto.SHA256(username+password+pin)));
					var key = keys.privkey.toString();
					var address = keys.pubkey.toString();
					if(address == saved_address)
					{
						var qrCode_confirm = qr_code.qrcode(3, 'L');
						var text = key.replace(/^[\s\u3000]+|[\s\u3000]+$/g, '');
						qrCode_confirm.addData(text);
						qrCode_confirm.make();
						$('#braincontrol #step-qr-backups .qr_code_title').html(base.lang('Private Key:') + ' ' + key);
						$('#braincontrol #step-qr-backups .qr_code').html(qrCode_confirm.createImgTag(4));
						braincontrol.slide('up', 'step-qr-backups', function()
						{
							braincontrol.unload();
						})
					}
					else
					{
						base.alert(base.lang('Unknown confirmation error!'));
						braincontrol.unload();
					}
				}
			}
		});

		// AUTOLOAD
		try{
			var reader = new FileReader();
		}catch(e){
			$('#'+options.id).find('#step-profile #qr-scan-code').hide();
		}
	}

}