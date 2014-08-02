$(document).ready(function() {

    var BGPage = chrome.extension.getBackgroundPage();

    page_details = BGPage.get_page_details();

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

    $('#new_bookmark').show();

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
    });
});