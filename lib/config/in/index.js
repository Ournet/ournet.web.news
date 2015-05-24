module.exports = {
  prefix: 'forecast',
  name: 'Ournet.in',
  language: 'en',
  languages: ['en'],
  country: 'in',
  timezone: 'Asia/Kolkata',
  domain: 'ournet.in',
  host: 'weather.ournet.in',
  hour_format: 'HH:mm',
  email: 'info@ournet-group.com',
  googleAnalyticsId: 'UA-1490399-31',
  placesCount: 39000,
  widgetGoogleAnalyticsId: 'UA-1490399-54',
  projects: {
    news: 'news.ournet.in',
    weather: 'weather.ournet.in',
    //opinia: 'mnenie.ournet.bg'//,
    //exchange: 'curs.ournet.bg'
  },
  shareDataServices: ['facebook', 'twitter', 'google-plus'],
  socialPluginsHtmlCode: '<iframe src="http://www.facebook.com/plugins/likebox.php?href=http%3A%2F%2Fwww.facebook.com%2Fpages%2FOurNetin%2F238491036247420&amp;width=300&amp;colorscheme=light&amp;connections=10&amp;stream=false&amp;header=false&amp;height=255" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:300px; height:255px;" allowTransparency="true"></iframe>',
  isOldId: function(id) {
    return 2940283 >= id && id >= 2938018;
  },
  internationalIds: ['ro', 'cz', 'it', 'md', 'hu', 'ru', 'pl', 'bg', 'al'],
  mainPlaces: [1254163, 1255634, 1258526, 1258980, 1259425, 1260086, 1261481, 1264527, 1264733, 1269515, 1269771, 1269843, 1273313, 1274746, 1275004, 1275339, 1275817, 1275841, 1277333, 1279186],
  capitalId: 1261481
};
