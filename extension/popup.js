var BGPage = chrome.extension.getBackgroundPage();
var page_details = BGPage.get_page_details();
var _token = null;
var _api_url = null;

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

chrome.storage.local.get('api_url', function(obj) {

    if (obj.api_url === undefined || obj.api_url === null) {
        _api_url = 'http://connexion.me';
    } else {
        _api_url = obj.api_url;
    }

    if (_api_url !== 'http://connexion.me') {
        $('#popup_title').attr('style', 'color: red');
    }

    $('#api_url').val(_api_url);
});

$('#btn_sign_in').click(function() {
    form_data = {
        'email': $('#login_email').val(),
        'password': $('#login_password').val()
    };

    $.ajax({
        url: 'http://connexion.me/api/v1.0/auth/login',
        type: 'POST',
        data: form_data,
        success: function(data, textStatus, jqXHR) {
            _token = data.result.token;

            set_storage_object();

            $('#sp_title').val(page_details.title);
            $('#sp_url').html(page_details.url);
            $('#sp_hostname').html(page_details.hostname);

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
    data.title = $('#sp_title').val();

    $.ajax({
        url: 'http://connexion.me/api/v1.0/bookmark/set',
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

$('#options').click(function() {
    $('.cpanel').hide();
    $('#update_options').show();
});

$('#btn_save_options').click(function() {
    _api_url = $('#api_url').val();

    set_storage_object();

    logout();
});

$(document).on('click','.navbar-collapse.in',function(e) {
    if( $(e.target).is('a') ) {
        $(this).collapse('hide');
    }
});

function check_bookmark(token, url) {
    $.ajax({
        url: 'http://connexion.me/api/v1.0/bookmark/get?token=' + token + '&url=' + escape(url),
        type: 'GET',
        success: function(data, textStatus, jqXHR) {
            set_storage_object();

            $('#sp_title').val(data.result.title);
            $('#sp_url').html(data.result.url);
            $('#sp_hostname').html(data.result.hostname);
            $('#tags').val(data.result.tags);

            setup_page();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);

            if (jqXHR.status == 404) {
                $('#sp_title').val(page_details.title);
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
    $('#logout').show();
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
        'token': _token,
        'api_url': _api_url
    };

    console.log('set');
    console.log(obj);

    chrome.storage.local.set(obj, function() {});
}