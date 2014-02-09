blockchain = new function(){

	this.balance = function(address, callback)
	{
		this.query('addressbalance', address, 0, callback);
	}

	this.query = function(func, vars, confirmations, callback)
	{
		var url = 'https://blockchain.info/q/'+func+'/'+vars;
		if(!vars || vars == 'false')
		{
			url = 'https://blockchain.info/q/'+func;
		}
		if(!confirmations) confirmations = 0;
		if(confirmations) url+= '?confirmations='+confirmations;
		$.ajax({
			url: url,
			success: function(results)
			{
				callback(results);
			}
		})
	}

	this.balances = function(count)
	{
		var accounts = base.get('accounts');
		var now = new Date().getTime();
		$('#braincontrol-holder #page-accounts .account .btc').each(function(i)
		{
			var span = $(this);
			var address = $(span).attr('data-address');
			var username = $(span).attr('data-username');
			var account = accounts[username];
			if(account)
			{
				var ts = account.ts;
				var limit = ts + 60000; // 60000 = 1 Minute
				var original_balance = parseFloat(account.btc * 100000000);
				if(now > limit)
				{
					blockchain.balance(address, function(results)
					{
						var balance = parseFloat(results / 10000000);
						$(span).text(balance);
						accounts[username].btc = balance;
						accounts[username].ts = now;
						base.set('accounts', accounts);
						if(results > original_balance)
						{
							var extra_btc = parseFloat((results - original_balance) / 100000000);
							base.alert(base.lang('Incoming Payment of '+extra_btc+' BTC Received'));
						}
					});
				}
			}
		});
	}
}