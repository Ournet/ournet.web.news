'use strict';

module.exports = {
	topicByName: {
		name: 'topics_topicByName',
		query: '(name:$name,lang:$lang,country:$country){id slug name wikiName abbr type category region}'
	},
	topicStories: {
		name: 'stories_storiesByTopicId',
		query: '(topicId:$topicId,limit:$limit){id slug:uniqueName title imageId isImportant summary countViews countNews countVideos createdAt}'
	}
};
