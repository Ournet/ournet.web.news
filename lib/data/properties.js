'use strict';

module.exports = {
	topicByName: {
		name: 'topics_topicByName',
		query: '(name:$name,lang:$lang,country:$country){id slug name wikiName abbr type category region description}'
	},
	webpage: {
		name: 'news_webpage',
		query: '(id:$id,country:$country,lang:$lang){id slug:uniqueName host path title imageId summary storyId videoId createdAt topics{id slug:uniqueName name abbr type}}'
	},
	story: {
		name: 'stories_story',
		query: '(id:$id){id slug:uniqueName host path summary createdAt countViews countNews imageId imageHost videos quotes title isImportant category topics{id slug:uniqueName name abbr type}}'
	},
	storyWebpages: {
		name: 'news_webpages',
		query: '(where:$where,country:$country,lang:$lang,limit:10,order:"-createdAt"){id slug:uniqueName host path title imageId videoId}'
	},
	topicStories: {
		name: 'stories_storiesByTopicId',
		query: '(topicId:$topicId,limit:$limit){id slug:uniqueName summary host path createdAt countViews countNews imageId videos title isImportant category}'
	},
	latestWebpages: {
		name: 'news_webpages',
		query: '(where:$where,country:$country,lang:$lang,limit:$limit,order:"-createdAt"){id slug:uniqueName summary host path title imageId videoId createdAt}'
	},
	video: {
		name: 'videos_video',
		query: '(id:$id){id sourceId sourceType createdAt}'
	},
	videos: {
		name: 'videos_videos',
		query: '(ids:$ids){id sourceId sourceType createdAt}'
	},
	quote: {
		name: 'quotes_quote',
		query: '(id:$id){id text createdAt author{id name slug:uniqueName} webpage{id title host path slug:uniqueName}}'
	},
	quotes: {
		name: 'quotes_quotes',
		query: '(ids:$ids){id text createdAt author{id name slug:uniqueName} webpage{id title host path slug:uniqueName}}'
	},
	quotesByAuthorId: {
		name: 'quotes_quotesByAuthorId',
		query: '(authorId:$authorId,limit:$limit){id text createdAt author{id name slug:uniqueName} webpage{id title host path slug:uniqueName}}'
	},
	quotesByTopicId: {
		name: 'quotes_quotesByTopicId',
		query: '(topicId:$topicId,limit:$limit){id text createdAt author{id name slug:uniqueName} webpage{id title host path slug:uniqueName}}'
	},
	viewStory: {
		name: 'stories_viewStory',
		query: '(id:$id){id countViews}'
	},
	feeds: {
		name: 'news_feeds',
		query: '(where:$where,limit:$limit,order:$order){id websiteId}'
	},
	websites: {
		name: 'news_websites',
		query: '(where:$where,limit:$limit,order:$order){id title host}'
	},
	website: {
		name: 'news_website',
		query: '(where:$where){id title host createdAt status}'
	}
};
