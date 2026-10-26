function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	const completed_events = tweet_array.filter(tweet => tweet.source == 'completed_event');
	const activity_counts = {};
	completed_events.forEach(tweet => {
		activity_counts[tweet.activityType] = (activity_counts[tweet.activityType] || 0) + 1;
	});
	const sorted_activities = Object.keys(activity_counts).sort((a, b) => activity_counts[b] - activity_counts[a]);
	const top_activities = sorted_activities.slice(0, 3);

	document.getElementById('numberActivities').innerText = sorted_activities.length;
	document.getElementById('firstMost').innerText = top_activities[0];
	document.getElementById('secondMost').innerText = top_activities[1];
	document.getElementById('thirdMost').innerText = top_activities[2];

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": tweet_array
	  }
	  //TODO: Add mark and encoding
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
	const top_events = completed_events.filter(tweet => top_activities.includes(tweet.activityType));

	function meanDistance(tweets) {
		return tweets.reduce((sum, tweet) => sum + tweet.distance, 0) / tweets.length;
	}

	const sorted_by_distance = top_activities.slice().sort((a, b) =>
		meanDistance(top_events.filter(tweet => tweet.activityType == b)) - meanDistance(top_events.filter(tweet => tweet.activityType == a)));
	document.getElementById('longestActivityType').innerText = sorted_by_distance[0];
	document.getElementById('shortestActivityType').innerText = sorted_by_distance[sorted_by_distance.length - 1];

	const isWeekend = tweet => tweet.time.getDay() == 0 || tweet.time.getDay() == 6;
	const weekend_mean = meanDistance(top_events.filter(isWeekend));
	const weekday_mean = meanDistance(top_events.filter(tweet => !isWeekend(tweet)));
	document.getElementById('weekdayOrWeekendLonger').innerText = weekend_mean > weekday_mean ? 'weekends' : 'weekdays';
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});