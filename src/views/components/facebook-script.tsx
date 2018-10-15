
import * as React from 'react';

export default function (facebookId: string, lang: string, country: string) {
    return (
        <script dangerouslySetInnerHTML={{
            __html: `(function(d, s, id) {
var js, fjs = d.getElementsByTagName(s)[0];
if (d.getElementById(id)) return;
js = d.createElement(s); js.id = id;
js.src = "//connect.facebook.net/${lang + '_' + country.toUpperCase()}/sdk.js#xfbml=1&version=v2.6&appId=${facebookId}";
fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));`}}></script>
    )
}
