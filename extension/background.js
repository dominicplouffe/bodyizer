var details = {};
var active_url = null;
var ports = {};
var _token = null;
var _api_url = null;
var _images = {};

var ports = {};

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action == 'popup_ready') {
        res = details[active_url];
        sendResponse({'action': 'popup_details', 'result': res});



    } else if (request.action == 'take_screenshot') {

        take_screenshot(sendResponse);

    } else if (request.action == 'get_screenshot') {

        sendResponse({'action': 'screenshot_result', 'result': _images[active_url]});

    } else if (request.action == 'set_storage') {
        _token = request.result.token;
        _api_url = request.result.api_url;

        for (var tabId in ports) {
            port = ports[tabId];
            port.postMessage({'action': 'set_token', 'result': {'token': _token}});
            port.postMessage({'action': 'set_api_url', 'result': {'api_url': _api_url}});
        }
    } else {
        console.log('Unknown Action');
        console.log(request);
    }
});

chrome.extension.onConnect.addListener(function(port) {
    ports[port.sender.tab.id] = port;

    port.onMessage.addListener(function(request) {
        if (request.action == 'ready') {
            console.log('action => ready');
            port.postMessage({'action': 'get_info'});
        } else if (request.action == 'send_info') {
            console.log('action => send_info');
            result = request.result;

            if (_images[result.url] !== undefined) {
                result.image = _images[result.url];
            }
            details[result.url] = result;
        }
    });

    port.onDisconnect.addListener(function(request) {
        delete ports[request.sender.tab.id];
        delete details[request.sender.tab.url];
    });

    port.postMessage({'action': 'set_token', 'result': {'token': _token}});
    port.postMessage({'action': 'set_api_url', 'result': {'api_url': _api_url}});
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    url = tab.url;
    active_url = url;
});

chrome.tabs.onActivated.addListener(function(tab) {
    chrome.tabs.get(tab.tabId, function(tab) {
        if (tab !== undefined) {
            url = tab.url;
            active_url = url;
        }
    });
});

chrome.storage.local.get('token', function(obj) {
    if (obj.token !== undefined && obj.token !== null) {
        _token = obj.token;
    }
});

chrome.storage.local.get('api_url', function(obj) {
    if (obj.api_url === undefined || obj.api_url === null) {
        _api_url = 'http://connexion.me';
    } else {
        _api_url = obj.api_url;
    }
});


function take_screenshot(sendResponse) {
    console.log('take screenshot');

    chrome.tabs.captureVisibleTab(
        null,
        {format: 'png', quality: 100},
        function(dataURI) {
            if (dataURI !== undefined) {
                _images[active_url] = dataURI;
                // sendResponse({'action': 'screenshot_taken', 'result': _images[active_url]});
            }
        }
    );
}