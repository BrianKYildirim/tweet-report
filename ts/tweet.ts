class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        if (/^Just (completed|posted)/i.test(this.text)) {
            return "completed_event";
        }
        if (/^Watch my/i.test(this.text) || /#RKLive/i.test(this.text)) {
            return "live_event";
        }
        if (/^Achieved/i.test(this.text) || /I just set a goal/i.test(this.text)) {
            return "achievement";
        }
        return "miscellaneous";
    }

    private get strippedText():string {
        let stripped = this.text;
        if (this.source == "live_event" || this.source == "achievement") {
            return "";
        }
        if (this.source == "completed_event") {
            const dashIndex = stripped.indexOf(" - ");
            if (dashIndex == -1) {
                return "";
            }
            stripped = stripped.substring(dashIndex + 3);
        }
        stripped = stripped.replace(/https?:\/\/\S+/g, "").replace(/#Runkeeper/gi, "").trim();
        if (stripped == "TomTom MySports Watch") {
            return "";
        }
        return stripped;
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        return this.strippedText.length > 0;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        return this.strippedText;
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        const match = this.text.match(/^Just (?:completed|posted) an? (?:[\d.]+ (?:km|mi) )?(.+?)(?: in [\d:]+| with @?Runkeeper| - |\.? *https?:|\.? *#Runkeeper|\.$|$)/i);
        if (!match) {
            return "unknown";
        }
        return match[1].replace(/ (workout|practice|session)$/i, "").trim().toLowerCase();
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        const match = this.text.match(/([\d.]+) (km|mi)\b/i);
        if (!match) {
            return 0;
        }
        const value = parseFloat(match[1]);
        if (match[2].toLowerCase() == "km") {
            return value / 1.609;
        }
        return value;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        const linkedText = this.text.replace(/https?:\/\/\S+/g, (url) => '<a href="' + url + '" target="_blank">' + url + '</a>');
        return "<tr><td>" + rowNumber + "</td><td>" + this.activityType + "</td><td>" + linkedText + "</td></tr>";
    }
}