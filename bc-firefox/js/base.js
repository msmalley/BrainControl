var config;
var buttons;
var blockchain;
var braincontrol;
var bc_settings;
var bc_starting_panel;
var bc_alerts;

var vals = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
var positions = {};
for (var i=0 ; i < vals.length ; ++i) {
    positions[vals[i]] = i;
}
var address_types = {
    prod: '00',
    testnet: '6f'
};
var p2sh_types = {
    prod: '05',
    testnet: 'c4'
};

var base = new function(){

	// CHECK IF COMPATIBLE
	this.compatible = function(options)
	{
		try{
			var got = base.get('options');
			if(got) return true;
			base.set('options', options);
			return true;
		}catch(e){
			return false;
		}
	}
	this.really_compatible = function(options)
	{
		try{
			localStorage.setItem('bc.temp', JSON.stringify({test:'testing'}));
			return localStorage['bc.temp'];
		}catch(e){
			return false;
		}
	}

	// PLACEHOLDER FOR INTERNATIONALIZATION
	this.lang = function(text)
	{
		return text;
	}

	this.is_json = function(string)
	{
		try {
			if(string) JSON.parse(string);
			else return false;
		} catch (e) {
			return false;
		}
		return true;
	}

	// SET STORE
	this.set = function(key, value)
	{
		localStorage.setItem('bc.'+key, JSON.stringify(value));
	}

	// GET FROM STORE
	this.get = function(key)
	{
		if(this.is_json(localStorage['bc.'+key]))
		{
			return $.parseJSON(localStorage['bc.'+key])
		}
		else if(localStorage['bc.'+key])
		{
			return localStorage['bc.'+key];
		}
		return false;
	}

	// UPDATE KEY FROM STORE
	this.update = function(col, key, value)
	{
		var objs = this.get(col);
		objs[key] = value;
		this.set(col, objs);
	}

	// RESET STORE
	this.reset = function()
	{
		this.set('accounts', null);
		this.set('contacts', null);
		this.set('templates', null);
		this.set('stats', null);
		this.set('alert', null);
		this.set('alerts', null);
		this.set('salt', null);
	}

	this.alert = function(message, single)
	{
		if(single)
		{
			var this_alert = base.get('alert');
			var alerts = base.get('alerts');
			var spaceless_message = message.replace(/\W/g, '');
			var minimal_message = spaceless_message.toLowerCase();
			if(!alerts) alerts = new Object();
			if((bc_alerts && bc_alerts[minimal_message]) || (this_alert && alerts[minimal_message])) return false;
			else if(!bc_alerts)
			{
				bc_alerts = new Object();
				if(this_alert != 'once')
				{
					alert(base.lang('Please note that since you are using this on a small screen, any text hidden from your particular view will be alerted to you once per session.'));
					if(confirm(base.lang('Clicking cancel below will show this text during each session - click OK for them to only ever be shown once.')))
					{
						base.set('alert', 'once');
						bc_alerts[minimal_message] = base.lang(message);
						alerts[minimal_message] = base.lang(message);
						base.set('alerts', alerts);
						alert(base.lang(message));
					}
					else
					{
						bc_alerts[minimal_message] = base.lang(message);
						alert(base.lang(message));
					}
				}
				else
				{
					bc_alerts[minimal_message] = base.lang(message);
					alerts[minimal_message] = base.lang(message);
					base.set('alerts', alerts);
					alert(base.lang(message));
				}
				
			}
			else
			{
				bc_alerts[minimal_message] = base.lang(message);
				var alerted = base.get('alert');
				if(alerted == 'once')
				{
					alerts[minimal_message] = base.lang(message);
					base.set('alerts', alerts);
				}
				alert(base.lang(message));
			}
		}
		else
		{
			alert(base.lang(message));
		}
	}

	this.endian = function(string) {
		var out = []
		for(var i = string.length; i > 0; i-=2) {
			out.push(string.substring(i-2,i));
		}
		return out.join("");
	}

}