'use strict';

module.exports = {
  prefix: 'news',
  name: 'Click.md',
  language: 'ro',
  languages: ['ro', 'ru'],
  country: 'md',
  timezone: 'Europe/Bucharest',
  domain: 'click.md',
  host: 'news.click.md',
  hour_format: 'HH:mm',
  email: 'info@click.md',
  googleAnalyticsId: 'UA-1490399-23',
  favicon: '//assets.ournetcdn.net/ournet/img/icons/click-icon-16.png',
  projects: {
    news: 'news.click.md',
    weather: 'meteo.click.md',
    //opinia: 'opinia.click.md',
    exchange: 'curs.click.md'
  },
  shareDataServices: ['facebook', 'odnoklassniki', 'plusone', 'twitter'],
  socialPluginsHtmlCode: '<iframe src="https://www.facebook.com/plugins/likebox.php?href=http%3A%2F%2Fwww.facebook.com%2Fpages%2FClickmd%2F144591008926117&amp;width=300&amp;colorscheme=light&amp;connections=10&amp;stream=false&amp;header=false&amp;height=255" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:300px; height:255px;" allowTransparency="true"></iframe>',
  facebookId: '111558655578824',
  internationalIds: ['ro', 'ru', 'it', 'bg', 'hu', 'cz', 'in'],
  capitalId: 618426,
  disqusId: 'clickmd',

  dfp: {
    location: {
      right1: '/19379494/ournet-md-news_right-1',
      aside1: '/19379494/ournet-md-news_aside-1',
      bottom1: '/19379494/ournet-md-news_bottom-1',
      center1: '/19379494/ournet-md-news_center-1'
    },
    slots: {
      '/19379494/ournet-md-news_center-1': {
        id: 'div-gpt-ad-1511814202269-0',
        sizes: [[468, 60], [336, 280], [480, 320], [320, 50]]
      },
      '/19379494/ournet-md-news_bottom-1': {
        id: 'div-gpt-ad-1511813454598-0',
        sizes: [[468, 60], [300, 100], [336, 280], [480, 320], [300, 250]]
      },
      '/19379494/ournet-md-news_aside-1': {
        id: 'div-gpt-ad-1511813037218-0',
        sizes: [[300, 250], [320, 480], [240, 400], [250, 250], [336, 280]]
      },
      '/19379494/ournet-md-news_right-1': {
        id: 'div-gpt-ad-1511811532159-0',
        sizes: [[160, 600], [120, 600]]
      }
    }
  }
};
