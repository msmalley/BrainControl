var BC_BASE_URL = window.location.href;
if(BC_BASE_URL.substring(BC_BASE_URL.length-10) == "index.html")
{
	BC_BASE_URL = BC_BASE_URL.substring(0, BC_BASE_URL.length-10);
}

config = new function(){

	this.defaults = function()
	{
		var defaults = {
			id: 'braincontrol',
			name: 'BrainControl',
			salt: 'braincontrolmesalt',
			stats: [
				{id: 'dashboard-usd', fact: base.lang('BTC to USD'), figure: base.lang('loading')},
				{id: 'dashboard-24tx', fact: base.lang('Daily Transactions'), figure: base.lang('loading')},
				{id: 'dashboard-24sent', fact:base.lang('Daily BTC Sent'), figure: base.lang('loading')},
				{id: 'dashboard-hash', fact:base.lang('Hash Rate GH/s'), figure: base.lang('loading')},
				{id: 'dashboard-found', fact:base.lang('BTC Discovered'), figure: base.lang('loading')},
				{id: 'dashboard-cap', fact:base.lang('Market Cap USD'), figure: base.lang('loading')}
			],
			ux: {
				pin: {
					title: base.lang('Pin<span>Confirmation</span>'),
					intro: base.lang('For those that are extra paranoid, use a 6 digit PIN number for extra security.')
				},
				calculator: {
					title: base.lang('BTC<span>Calculator</span>'),
					placeholder: base.lang('Convert from USD to BTC')
				},
				qr: {
					title: base.lang('QR<span>Code</span>'),
					h6: base.lang('Address')
				},
				profile: {
					title: base.lang('Important<span>Settings</span>')
				},
				buttons: {
					loading: base.lang('Loading!'),
					recover: base.lang('Recover Lost BC Accounts'),
					backup: base.lang('Backup'),
					print_key: base.lang('Print Key'),
					print_address: base.lang('Print Address'),
					send: base.lang('Send'),
					clear: base.lang('Clear'),
					notes: base.lang('Notes'),
					scan: base.lang('Scan OR Import QR Code - Beta'),
					qr: base.lang('QR'),
					new_in: base.lang('Generate New Wallet'),
					new_contact: base.lang('Add New Contact'),
					reset: base.lang('Reset Device'),
					import_keys: base.lang('Import Keys'),
					recover: base.lang('Recover Lost Account')
				},
				info: {
					salt: base.lang('A salt is another unique identifier for creating and restoring wallets. It\'s default value is stored on the device, but you can also override the value for each individual wallet should you prefer.')
				}
			},
			forms: {
				send: [
					{paragraph: [
						{ text: base.lang('Send Bitcoin from one of your wallets to any known address using the following form'), classes:'unessential' },
					]},
					{id: 'type', value: 'send_payment'},
					{id: 'to', label: base.lang('To'), type:'text', placeholder: base.lang('BTC Address'), icon: [{href: '#', id: 'bc-select-contact', img: 'user'}]},
					{id: 'from', label: base.lang('From'), select:{options:[]}},
					{id: 'fee', label: base.lang('Fee'), type:'text', placeholder: base.lang('0.0001 Min'), value: 0.0001},
					{id: 'amount', label: base.lang('Amount'), type:'text', placeholder: base.lang('BTC to Send')},
					{id: 'submit', value: base.lang('Send'), type:'submit', classes:'bc-block bc-button bc-primary bc-submit'},
					{id: 'password'},
					{id: 'salt'},
					{id: 'pin'}
				]
			},
			panels: [],
			app: {
				header: {
					left: {
						href: '#',
						direction: 'right',
						id: 'step-calculator',
						icon: 'bc-calculator'
					},
					right: {
						href: '#',
						direction: 'left',
						id: 'step-profile',
						icon: 'bc-profile'
					},
					title: base.lang('Brain<span>Control</span>')
				},
				nav: [
					{ href: '#', classes: 'bc-slide active', id: 'page-markets', icon: 'bc-markets', text: 'Markets' },
					{ href: '#', classes: 'bc-slide', id: 'page-accounts', icon: 'bc-accounts', text: 'Accounts' },
					{ href: '#', classes: 'bc-slide', id: 'page-send', icon: 'bc-send', text: 'Send' },
					{ href: '#', classes: 'bc-slide', id: 'page-contacts', icon: 'bc-contacts', text: 'Contacts' },
				]
			}
		};
		return defaults;
	}

	this.settings = function(options)
	{
		var salt = options.salt;
		var saved_salt = base.get('salt');
		var starting_text = base.lang('Setup this device');
		var starting_direction = 'down';
		var starting_step = 'step-setup';
		var installed = false;
		if(base.really_compatible())
		{
			if(base.get('accounts'))
			{
				installed = true;
				starting_direction = false;
				starting_step = 'page-markets';
				starting_text = base.lang('Return to the App');
			}
		}
		if(saved_salt) salt = saved_salt;
		bc_starting_point = {
			id: 'step-setup',
			top: {
				buttons: [
					{ href: '#', classes: 'bc-block bc-icon bc-primary bc-slide', text: base.lang('setup your device now'), after: base.lang('this is a live working version'), icon: 'chevron-circle-right', 'direction':'left', 'id':'step-start' }
				]
			},
			middle: {
				icon: 'check-circle',
				warning: base.lang('This device is compatible')
			},
			bottom: {
				text: base.lang('It only takes a minute to setup your Bitcoin wallet. No need to download additional software or have a Bitcoin node installed.')
			}
		};
		options.panels.push(bc_starting_point);
		options.panels.push({
			id: 'step-start',
			top: {
				text: base.lang('Important<span>Warning</span>'),
				close: true
			},
			middle: {
				paragraphs: [
					{ text: base.lang('Since this is the first time you have visited this application using this browser (or have somehow re-set your LocalStorage) - you will first need to configure the application.') },
					{ text: base.lang('The application uses a combination of salts, label names and passwords to generate inline deterministc key-pairs.') },
					{ text: base.lang('The private keys are NOT stored on ANY device so re-entering the passwords is frequently required and important.') },
					{ text: base.lang('The application uses BlockChain.info to ascertain market values, account balanaces and relaying the raw transactions.'), classes: 'unessential' }
				]
			},
			bottom: {
				buttons: [
					{ href: '#', classes: 'bc-block bc-icon bc-action bc-slide', text: base.lang('understood'), icon: 'chevron-circle-right', direction: 'left', id:'step-id' }
				]
			}
		});
		options.panels.push({
			id: 'step-id',
			top: {
				text: base.lang('Your<span>Identity</span>'),
				close: true
			},
			middle: {
				text: base.lang('If you forget your passwords and names, or change then lose salts; you will not be able to access wallets that are not backed-up.'),
				form: [
					{ id: 'type', value: 'new_id' },
					{ id: 'salt', type: 'text', label: base.lang('Device Salt'), value: salt, placeholder: base.lang('A memorable salt is required!'), icon: 'info-circle', icons: [{icon:'info-circle'}] },
					{ id: 'name', type: 'text', label: base.lang('Account Name') },
					{ id: 'password', type: 'password', label: base.lang('Passphrase') },
					{ id: 'password_repeat', type: 'password', label: base.lang('Repeat') },
					{ id: 'pin', classes: 'pin_number' },
				]
			},
			bottom: {
				buttons: [
					{ href: '#', classes: 'bc-icon bc-action bc-half bc-pin bc-slide', text: base.lang('add pin'), icon: 'plus-circle', direction: 'up', id: 'step-pin', back_direction: 'down', back_id: 'step-id' },
					{ href: '#', classes: 'bc-primary bc-half bc-submit', text: base.lang('submit') }
				]
			}
		});
		options.panels.push({
			id: 'step-new',
			top: {
				text: base.lang('New<span>Wallet</span>'),
				close: true
			},
			middle: {
				text: base.lang('If you forget your passwords and names, or change then loose salts; you will not be able to access wallets that are not backed-up.'),
				form: [
					{ id: 'type', value: 'new_id' },
					{ id: 'name', type: 'text', label: base.lang('Account Name') },
					{ id: 'password', type: 'password', label: base.lang('Passphrase') },
					{ id: 'password_repeat', type: 'password', label: base.lang('Repeat') },
					{ id: 'salt', type: 'text', label: base.lang('Extra Salt'), value: salt, placeholder: base.lang('A memorable salt is required!'), icon: 'info-circle', icons: [{icon:'info-circle'}]  },
					{ id: 'pin', classes: 'pin_number' },
				]
			},
			bottom: {
				buttons: [
					{ href: '#', classes: 'bc-icon bc-action bc-half bc-pin bc-slide', text: base.lang('add pin'), icon: 'plus-circle', direction: 'up', id: 'step-pin', back_direction: 'down', back_id: 'step-id' },
					{ href: '#', classes: 'bc-primary bc-half bc-submit', text: base.lang('submit') }
				]
			}
		});
		options.panels.push({
			id: 'step-recover',
			top: {
				text: base.lang('Recover<span>Account</span>'),
				close: [{direction:'down', id:'step-profile'}]
			},
			middle: {
				text: base.lang('This allows you to import / re-create accounts created at other domains.'),
				form: [
					{ id: 'type', value: 'recover_accounts' },
					{ id: 'name', type: 'text', label: base.lang('Account Name') },
					{ id: 'password', type: 'password', label: base.lang('Passphrase') },
					{ id: 'password_repeat', type: 'password', label: base.lang('Repeat') },
					{ id: 'salt', type: 'text', label: base.lang('Salt Used'), placeholder: base.lang('The original salt'), icon: 'info-circle', icons: [{icon:'info-circle'}]  },
					{ id: 'url', type: 'text', label: base.lang('URL Used'), placeholder: base.lang('Original URL?') },
					{ id: 'pin', classes: 'pin_number' },
				]
			},
			bottom: {
				buttons: [
					{ href: '#', classes: 'bc-icon bc-action bc-half bc-pin bc-slide', text: base.lang('add pin'), icon: 'plus-circle', direction: 'up', id: 'step-pin', back_direction: 'down', back_id: 'step-recover' },
					{ href: '#', classes: 'bc-primary bc-half bc-submit', text: base.lang('submit') }
				]
			}
		});
		options.panels.push({
			id: 'step-import',
			top: {
				text: base.lang('Import<span>Keys</span>'),
				close: [{direction:'down', id:'step-profile'}]
			},
			middle: {
				form: [
					{ id: 'type', value: 'import_keys' },
					{ id: 'key', type: 'text', label: base.lang('Private Key') },
					{ id: 'name', type: 'text', label: base.lang('Account Name') },
					{ id: 'password', type: 'password', label: base.lang('Passphrase') },
					{ id: 'password_repeat', type: 'password', label: base.lang('Repeat') },
					{ id: 'salt', type: 'text', label: base.lang('Desired Salt'), classes: 'unessential', value: salt, icon: 'info-circle', icons: [{icon:'info-circle'}]  },
					{ id: 'pin', classes: 'pin_number' },
				],
				paragraphs: [
					{ text: base.lang('Import private keys generated anywhere. The current device salt will be used to transfer the balance from that account into a new one created here with a network transaction fee of 0.0001'), classes: 'unessential' }
				]
			},
			bottom: {
				buttons: [
					{ href: '#', classes: 'bc-icon bc-action bc-half bc-pin bc-slide', text: base.lang('add pin'), icon: 'plus-circle', direction: 'up', id: 'step-pin', back_direction: 'down', back_id: 'step-import' },
					{ href: '#', classes: 'bc-primary bc-half bc-submit', text: base.lang('submit') }
				]
			}
		});
		options.panels.push({
			id: 'step-contact',
			top: {
				text: base.lang('New<span>Contact</span>'),
				close: true
			},
			middle: {
				text: base.lang('You can add contacts here then re-use them when sending payments. Add additional details using the notes button below.'),
				form: [
					{ id: 'type', value: 'new_contact' },
					{ id: 'name', type: 'text', label: base.lang('Contact Name') },
					{ id: 'address', type: 'text', label: base.lang('BTC Address') },
					{ id: 'tel' },
					{ id: 'email' },
					{ id: 'notes' }
				]
			},
			bottom: {
				buttons: [
					{ href: '#', classes: 'bc-icon bc-action bc-half bc-notes bc-slide', text: base.lang('notes'), icon: 'plus-circle', direction: 'up', id: 'step-notes', back_direction: 'down', back_id: 'step-contact' },
					{ href: '#', classes: 'bc-primary bc-half bc-submit', text: base.lang('submit') }
				]
			}
		});
		options.panels.push({
			id: 'step-notes',
			top: {
				text: base.lang('Contact<span>Info</span>'),
				close: true
			},
			middle: {
				form: [
					{ id: 'type', value: 'contact_info' },
					{ id: 'email', type: 'text', label: base.lang('Email') },
					{ id: 'tel', type: 'text', label: base.lang('Telephone') },
					{ id: 'notes', label: base.lang('Extra Notes'), textarea:true }
				]
			}
		});
		options.panels.push({
			id: 'step-note',
			top: {
				text: base.lang('Contact<span>Info</span>'),
				close: [{direction:'false', id:'page-contacts'}]
			},
			middle: {
				form: [
					{ id: 'email', type: 'text', label: base.lang('Email') },
					{ id: 'tel', type: 'text', label: base.lang('Telephone') },
					{ id: 'notes', label: base.lang('Extra Notes'), textarea:true }
				]
			},
			bottom: {
				buttons: [
					{ href: '#', classes: 'bc-primary bc-block bc-submit', text: base.lang('Save') }
				]
			}
		});
		options.panels.push({
			id: 'step-confirm',
			top: {
				text: base.lang('Confirm<span>Details</span>'),
				close: [{direction:'false', id:'page-accounts'}]
			},
			middle: {
				form: [
					{ id: 'type', value: 'confirm_details' },
					{ id: 'username' },
					{ id: 'password', type: 'password', label: base.lang('Passphrase') },
					{ id: 'salt', type: 'text', label: base.lang('Extra Salt'), value: salt },
					{ id: 'pin', classes: 'pin_number' },
				]
			},
			bottom: {
				buttons: [
					{ href: '#', classes: 'bc-icon bc-action bc-half bc-pin bc-slide invisible', text: base.lang('add pin'), icon: 'plus-circle', direction: 'up', id: 'step-pin', back_direction: 'down', back_id: 'step-confirm' },
					{ href: '#', classes: 'bc-primary bc-half bc-submit', text: base.lang('Confirm') }
				]
			}
		});
		options.panels.push({
			id: 'step-confirm-send',
			top: {
				text: base.lang('Confirm<span>Send</span>'),
				close: [{direction:'false', id:'page-send'}]
			},
			middle: {
				form: [
					{paragraph: [
						{ text: base.lang('Sending <span class="btc">0</span> BTC (worth <span class="usd">0</span> USD) and paying a <span class="fee">0</span> USD Transaction Fee to the Network...?'), classes:'unessential' },
					]},
					{ id: 'type', value: 'confirm_send' },
					{ id: 'password', type: 'password', label: base.lang('Passphrase') },
					{ id: 'salt', type: 'text', label: base.lang('Extra Salt'), value: salt },
					{ id: 'pin', classes: 'pin_number' },
					{ id: 'username' },
				]
			},
			bottom: {
				buttons: [
					{ href: '#', classes: 'bc-icon bc-action bc-half bc-pin bc-slide', text: base.lang('add pin'), icon: 'plus-circle', direction: 'up', id: 'step-pin', back_direction: 'down', back_id: 'step-confirm-send' },
					{ href: '#', classes: 'bc-primary bc-half bc-submit', text: base.lang('Confirm') }
				]
			}
		});
		return options;
	}

}