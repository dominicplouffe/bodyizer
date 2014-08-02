var BGPage = chrome.extension.getBackgroundPage();
var page_details = BGPage.get_page_details();
var _token = null;

data = {
    'title': page_details.title,
    'url': page_details.url,
    'hostname': page_details.hostname,
    'tags': '',
    'token': '1',
    'body': page_details.body,
    'ngrams': JSON.stringify(page_details.ngrams)
};

$('#sp_title').html(page_details.title);
$('#sp_url').html(page_details.url);
$('#sp_hostname').html(page_details.hostname);

chrome.storage.local.get('token', function(obj) {
    if (obj.token === undefined || obj.token === null) {
        $('#login').show();
    } else {
        validate_login(obj.token);
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
            alert(textStatus);
        }
    });

    return false;
});

$('#logout').click(function() {

    logout();

    return false;
});

function validate_login(token) {
    $.ajax({
        url: 'http://localhost:5001/api/v1.0/auth/validate?token=' + token,
        type: 'GET',
        success: function(data, textStatus, jqXHR) {
            _token = token;

            set_storage_object();

            setup_page();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            logout();
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