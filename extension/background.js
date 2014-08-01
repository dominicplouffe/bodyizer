var details = {};
var active_url = null;

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        details[request.url] = request;
    }
);


function get_page_details() {
    var return_value = {
        body: 'Body has not been processed.  Please reload the tab and try again.',
        ngrams: {},
        url: active_url,
        hostname: null,
        title: 'Not Available'
    };

    if (active_url !== null && details[active_url] !== undefined) {
        url_details = details[active_url];
        return_value.body = url_details.body;
        return_value.ngrams = url_details.ngrams;
        return_value.hostname = url_details.hostname;
        return_value.title = url_details.title;
    }

    return return_value;
}

chrome.tabs.onActivated.addListener(function(tab) {
    chrome.tabs.get(tab.tabId, function(tab) {
        url = tab.url;
        active_url = url;
    });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    url = tab.url;
    active_url = url;
});

chrome.tabs.onRemoved.addListener(function(tabId) {
    chrome.tabs.get(tab.tabId, function(tab) {
        url = tab.url;
        details[url] = undefined;
    });
});