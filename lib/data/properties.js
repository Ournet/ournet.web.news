'use strict';

module.exports = {
	topicByName: {
		name: 'topics_topicByName',
		query: '(name:$name,lang:$lang,country:$country){id slug name wikiName abbr type category region}'
	},
	topicStories: {
		name: 'stories_storiesByTopicId',
		query: '(topicId:$topicId,limit:$limit){id slug:uniqueName title imageId isImportant summary countViews countNews countVideos createdAt}'
	},
	webpage: {
		name: 'news_webpage',
		query: '(id:$id,country:$country,lang:$lang){id slug:uniqueName host path title imageId summary storyId videoId topics{id slug:uniqueName name abbr type}}'
	},
	quote: {
		name: 'quotes_quote',
		query: '(id:$id){id text createdAt author{id name slug:uniqueName} webpage{id title host path slug:uniqueName}}'
	},
	story: {
		name: 'stories_story',
		query: '(id:$id){id slug:uniqueName host path summary createdAt countViews countNews imageId videos title isImportant category topics{id slug:uniqueName name abbr type}}'
	},
	storyWebpages: {
		name: 'news_webpages',
		query: '(where:$where,country:$country,lang:$lang,limit:10,order:"-createdAt"){id slug:uniqueName host path title imageId videoId}'
	}
};
