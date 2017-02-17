'use strict';

module.exports = {
	findEntityByName: {
		name: 'topics_topicByName',
		query: '(name:$name,lang:$lang,country:$country){id slug}'
	}
};
