function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;

	const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	const times = tweet_array.map(tweet => tweet.time.getTime());
	document.getElementById('firstDate').innerText = new Date(Math.min(...times)).toLocaleDateString('en-US', dateOptions);
	document.getElementById('lastDate').innerText = new Date(Math.max(...times)).toLocaleDateString('en-US', dateOptions);

	function setClassText(className, text) {
		document.querySelectorAll('.' + className).forEach(element => {
			element.innerText = text;
		});
	}

	function formatPct(count, total) {
		return (count / total * 100).toFixed(2) + '%';
	}

	const categories = {
		completed_event: 'completedEvents',
		live_event: 'liveEvents',
		achievement: 'achievements',
		miscellaneous: 'miscellaneous'
	};
	for (const source in categories) {
		const count = tweet_array.filter(tweet => tweet.source == source).length;
		setClassText(categories[source], count);
		setClassText(categories[source] + 'Pct', formatPct(count, tweet_array.length));
	}

	const completedEvents = tweet_array.filter(tweet => tweet.source == 'completed_event');
	const writtenCount = completedEvents.filter(tweet => tweet.written).length;
	setClassText('written', writtenCount);
	setClassText('writtenPct', formatPct(writtenCount, completedEvents.length));
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});