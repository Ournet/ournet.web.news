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
  favicon: 'http://assets.ournetcdn.net/ournet/img/icons/click-icon-16.png',
  placesCount: 1700,
  projects: {
    news: 'news.click.md',
    weather: 'meteo.click.md',
    opinia: 'opinia.click.md',
    exchange: 'curs.click.md'
  },
  shareDataServices: ['facebook', 'twitter', 'odnoklassniki', 'google-plus'],
  socialPluginsHtmlCode: '<iframe src="http://www.facebook.com/plugins/likebox.php?href=http%3A%2F%2Fwww.facebook.com%2Fpages%2FClickmd%2F144591008926117&amp;width=300&amp;colorscheme=light&amp;connections=10&amp;stream=false&amp;header=false&amp;height=255" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:300px; height:255px;" allowTransparency="true"></iframe>',
  isOldId: function(id) {
    return 2940283 >= id && id >= 2938018;
  },
  internationalIds: ['ro', 'ru', 'it', 'bg', 'hu', 'cz', 'pl', 'in'],
  capitalId: 618426
};
