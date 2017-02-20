'use strict';

module.exports = {
	cache: {
		topics_topicByName: { max: 500, ttl: 1000 * 60 * 30 },
		news_webpage: false,
		stories_story: { max: 100, ttl: 1000 * 60 * 10 },
		news_webpages: false,
		stories_storiesByTopicId: { max: 100, ttl: 1000 * 60 * 20 },
		videos_video: { max: 500, ttl: 1000 * 60 * 30 },
		videos_videos: { max: 100, ttl: 1000 * 60 * 30 },
		quotes_quote: { max: 100, ttl: 1000 * 60 * 30 },
		quotes_quotes: false,
		quotes_quotesByAuthorId: { max: 100, ttl: 1000 * 60 * 30 },
		quotes_quotesByTopicId: { max: 100, ttl: 1000 * 60 * 30 }
	}
};
