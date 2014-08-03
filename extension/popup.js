var BGPage = chrome.extension.getBackgroundPage();
var page_details = BGPage.get_page_details();
var _token = null;

data = {
    'title': page_details.title,
    'url': page_details.url,
    'hostname': page_details.hostname,
    'tags': '',
    'token': null,
    'body': page_details.body,
    'ngrams': JSON.stringify(page_details.ngrams)
};

chrome.storage.local.get('token', function(obj) {
    if (obj.token === undefined || obj.token === null) {
        $('#login').show();
    } else {
        _token = obj.token;
        check_bookmark(obj.token, page_details.url);
    }
});

$('#btn_sign_in').click(function() {
    form_data = {
        'email': $('#login_email').val(),
        'password': $('#login_password').val()
    };

    $.ajax({
        url: 'http://localhost:5001/api/v1.0/auth/login',
        type: 'POST',
        data: form_data,
        success: function(data, textStatus, jqXHR) {
            _token = data.result.token;

            console.log(_token);
            console.log(data);

            set_storage_object();
            setup_page();
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            $('#login_not_found').show();
        }
    });

    return false;

});

$('#btn_add_bookmark').click(function() {

    data.tags = $('#tags').val();
    data.token = _token;

    $.ajax({
        url: 'http://localhost:5001/api/v1.0/bookmark/set',
        type: 'POST',
        data: data,
        success: function(data, textStatus, jqXHR) {
            $('#new_bookmark').hide();
            $('#new_bookmark_success').show();
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            if (jqXHR.status == 401) {
                logout();
            }
        }
    });

    return false;
});

$('#logout').click(function() {

    logout();

    return false;
});

function check_bookmark(token, url) {
    $.ajax({
        url: 'http://localhost:5001/api/v1.0/bookmark/get?token=' + token + '&url=' + escape(url),
        type: 'GET',
        success: function(data, textStatus, jqXHR) {
            set_storage_object();

            $('#sp_title').html(data.result.title);
            $('#sp_url').html(data.result.url);
            $('#sp_hostname').html(data.result.hostname);
            $('#tags').val(data.result.tags);

            setup_page();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);

            if (jqXHR.status == 404) {
                $('#sp_title').html(page_details.title);
                $('#sp_url').html(page_details.url);
                $('#sp_hostname').html(page_details.hostname);

                setup_page();
            } else if (jqXHR.status == 401) {
                logout();
            }
        }
    });
}

function setup_page() {
    $('.cpanel').hide();
    $('#new_bookmark').show();
}

function logout() {
    _token = null;

    set_storage_object();

    document.location.reload();
}

function set_storage_object() {
    obj = {
        'token': _token
    };

    chrome.storage.local.set(obj, function() {});
}