var BAD_TAGS = /editor|comment|rss|pagination|footer|header|popup/i;
var INVALID_TAGS = /form|img|script|combx|comment|community|disqus|extra|foot|header|menu|remark|rss|shoutbox|sidebar|sponsor|ad-break|agegate|pagination|pager|popup|tweet|twitter/i;
var VALID_TAGS = ["P", "TD", "PRE"];
var INVALID_INNER_DIV_TAGS = /<(a|blockquote|dl|div|ol|p|pre|table|ul)/i;

var _google_check_id = null;
var _token = null;
var _api_url = null;

//Check bottom of page, init() is called theree
function init() {
    chrome_check_connexion = document.getElementById('chrome_check_connexion');

    if (chrome_check_connexion !== null) {
        chrome_check_connexion.style.display = 'none';
    }

    _google_check_id = setInterval("populate_google();", 1000);
}

//----------------------------------------------------------------------------------------------
// GOOGLE SEARCH RESULTS
//----------------------------------------------------------------------------------------------
function populate_google() {
    if (document.location.href.indexOf('www.google') == -1) {
        clearInterval(_google_check_id);
    } else {
        console.log('it is google!');

        rhs = document.getElementById('rhs_block');

        if (rhs !== null) {
            clearInterval(_google_check_id);

            var search_value = document.getElementsByName('q')[0].value;

            var xmlhttp=new XMLHttpRequest();
            xmlhttp.onreadystatechange=function()
            {
                if (xmlhttp.readyState==4 && xmlhttp.status==200)
                {
                    var html = '<img src="http://connexion.me/static/img/icon.png" style="max-width: 50px; vertical-align: middle;" />';
                    html += '<span style="font-size: 20px;"> CONNEXION.ME</span>';
                    html += '<br/>';
                    html += 'Search Results from CONNEXION.ME';
                    html += '<br/><br/>';
                    result = JSON.parse(xmlhttp.response)['result'];

                    for (var i = 0; i < result.length; i++) {
                        var r = result[i];

                        html += '<div style="padding-bottom: 5px;">';
                        html += '<a href="' + _api_url + r.short_url + '">' + r.title + '</a>';
                        html += '</div>';
                    }

                    rhs.innerHTML += html + rhs.innerHTML;
                }
            };

            var url = _api_url + '/api/v1.0/bookmark/search?token=' + _token + '&q=' + search_value;
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
        }
    }
}

//----------------------------------------------------------------------------------------------
// INIT
//----------------------------------------------------------------------------------------------
init();