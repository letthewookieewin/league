$(document).ready(function(){

	$('.match-data').click(function(){

		$('.data').html("<img id='loader-main' src='/img/loading.gif'>");

		globalTimeout = 0;
		idIndex = 0;
		ids = [];

		var keys = ['5ec9cf1a-71be-44ef-8a54-e2ce3bbc1e45','664b8522-f6e1-466e-9ca3-10123fe43058'];
		var match_id = 1783948659;

		var url = encodeURI('https://na.api.pvp.net/api/lol/na/v2.2/match/' + match_id + '?api_key=' + keys[0]);
		console.log(url);
		//return;
		$.ajax({
			    url : url,
			    method: 'GET',
			    async : true,
			    success : function(data){
			    	//console.log(data);
			    	postMatchData(data);
			    },
			    error : function(xhr, status){
			        console.log(status);
			    }
			});

		// for (var i=0;i<1;i++)
		// {
		// 	var timeout = 250 * i;
		// 	setTimeout(function() {
		// 	scanMatches();
		// 	//startTime += 300;
		// 	},timeout);
		// }

		//var url = encodeURI('https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?api_key=664b8522-f6e1-466e-9ca3-10123fe43058');

		return false;
	});

});

function postMatchData(data)
{
	//console.log(data);
	$.ajax({
	    url : '/store_match_data_in_db',
	    data: data,
	    method: 'POST',
	    async : true,
	    success : function(data){
	    	console.log(data);
	    	$('.data').html(data);
	    },
	    error : function(xhr, status){
	        console.log(status);
	        console.log("could not store in db");
	    }
	});
	return false;
};