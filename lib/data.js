var external = module.exports;
var Webdata = require('ournet.data.webdata');
var Topics = require('ournet.data.topics');
var Stories = require('ournet.data.stories');
var Quotes = require('ournet.data.quotes');
var inited = false;

function init() {
  if (inited) return;
  inited = true;
  
  external.topics = {
    access: new Topics.AccessService(),
    util: Topics.utils,
    categories: Topics.categories
  };

  external.webdata = {
    access: Webdata.getCacheAccessService(),
    control: Webdata.getControlService(),
    search: Webdata.Search
  };

  external.stories = {
    access: new Stories.AccessService(),
    control: new Stories.ControlService(),
    search: Stories.Search
  };

  external.quotes = {
    access: new Quotes.AccessService(),
    control: new Quotes.ControlService()
  };
}

init();
