'use strict';
// Dependencies =========================
const Twit = require('twit');
const ura = require('unique-random-array');
const config = require('./config');
const tweets = require('./helpers/tweets');
const cron = require('node-cron');
const moment = require('moment');
const Twitter = new Twit({
  consumer_key: config.twitter.consumerKey,
  consumer_secret: config.twitter.consumerSecret,
  access_token: config.twitter.accessToken,
  access_token_secret: config.twitter.accessTokenSecret
});

const pickTweet = (tweets, category = null) => {
  if (tweets[category]) {
    return ura(tweets[category])();
  }
};

cron.schedule('8 * * * *', function() {
  const day = moment().day();
  const hour = moment().hour();
  const scheduledCategory = schedule[day][hour];
  if (scheduledCategory) {
    post(pickTweet(tweets, scheduledCategory));
  }
});

/* 
Schedule Structure
0-7 are the days of the week (Monday through saturday)
within each "day" object you can add a tweet category.
example:
this will tweet a "promotion" tweet at 10:00 on Monday
schedule = {
  //Monday
  '0': {
    '10': 'promotion' 
  }
}
*/
const schedule = {
  //SUNDAY
  '0': {
    '23': 'promotion'
  },
  //MONDAY
  '1': {
    '12': 'promotion'
  },
  //TUESDAY
  '2': {
    '22': 'articles'
  },
  //WEDNESDAY
  '3': {
    '6': 'promotion'
  },
  //THURSDAY
  '4': {
    '9': 'articles'
  },
  //FRIDAY
  '5': {
    '13': 'promotion'
  },
  //SATURDAY
  '6': {
    '3': 'promotion'
  }
};

const post = text => {
  Twitter.post(
    'statuses/update',
    {status: text},
    function(err, data, response) {
      console.log(data);
    }
  );
};
