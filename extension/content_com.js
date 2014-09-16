//----------------------------------------------------------------------------------------------
// COMMUNICATION
//----------------------------------------------------------------------------------------------
function send_page_details() {

    return_object = discovery();
    return_object.url = document.location.href;
    return_object.hostname = document.location.hostname;
    return_object.title = get_title();
    return_object.image = find_image();

    if (return_object.title) {
        return_object.title = return_object.title.trim();
    }

    console.log(discovery());

    port.postMessage({'action': 'send_info', 'result': return_object});
}

port = chrome.extension.connect();
port.postMessage({'action': 'ready'});

port.onMessage.addListener(function(request) {
    if (request.action == 'get_info') {
        send_page_details();
    } else if (request.action == 'set_token') {
        _token = request.result.token;
        console.log(_token);
    } else if (request.action == 'set_api_url') {
        _api_url = request.result.api_url;
        console.log(_api_url);
    }
});