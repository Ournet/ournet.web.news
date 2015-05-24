module.exports = {
  prefix: 'tempo',
  name: 'Ournet.it',
  language: 'it',
  languages: ['it'],
  country: 'it',
  timezone: 'Europe/Rome',
  domain: 'ournet.it',
  host: 'meteo.ournet.it',
  hour_format: 'HH:mm',
  email: 'info@ournet-group.com',
  googleAnalyticsId: 'UA-1490399-44',
  placesCount: 6000,
  widgetGoogleAnalyticsId: 'UA-1490399-55',
  projects: {
    news: 'news.ournet.it',
    weather: 'meteo.ournet.it',
    //opinia: 'mnenie.ournet.bg'//,
    //exchange: 'curs.ournet.bg'
  },
  shareDataServices: ['facebook', 'twitter', 'google-plus'],
  socialPluginsHtmlCode: '', // '<iframe src="http://www.facebook.com/plugins/likebox.php?href=http%3A%2F%2Fwww.facebook.com%2Fpages%2FOurNetro%2F156976714343293&amp;width=300&amp;colorscheme=light&amp;connections=10&amp;stream=false&amp;header=false&amp;height=255" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:300px; height:255px;" allowTransparency="true"></iframe>',
  isOldId: function(id) {
    return 2940283 >= id && id >= 2938018;
  },
  internationalIds: ['bg', 'cz', 'ro', 'al', 'md', 'hu', 'ru', 'pl', 'in'],
  mainPlaces: [2523665, 2524013, 2524245, 2524653, 3165456, 3166598, 3169070, 3169984, 3173529, 3174741, 3175537, 3175678, 3178671, 3178957, 3179661, 3179806, 3180423, 3181355, 3183178, 6534228],
  capitalId: 3169070
};
