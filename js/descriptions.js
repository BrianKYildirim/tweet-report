let written_tweets = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets
	written_tweets = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	}).filter(tweet => tweet.written);
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	const table = document.getElementById('tweetTable');
	const searchCount = document.getElementById('searchCount');
	const searchText = document.getElementById('searchText');
	searchCount.innerText = 0;
	searchText.innerText = '';

	document.getElementById('textFilter').addEventListener('input', function(event) {
		const query = event.target.value;
		searchText.innerText = query;
		if (query == '') {
			table.innerHTML = '';
			searchCount.innerText = 0;
			return;
		}
		const matches = written_tweets.filter(tweet => tweet.writtenText.toLowerCase().includes(query.toLowerCase()));
		searchCount.innerText = matches.length;
		table.innerHTML = matches.map((tweet, i) => tweet.getHTMLTableRow(i + 1)).join('');
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});
