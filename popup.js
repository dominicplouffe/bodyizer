var BGPage = chrome.extension.getBackgroundPage();

page_details = BGPage.get_page_details();

document.getElementById('dv_body_content').innerHTML = page_details.body;


var ngram_body = '';
for (var ngram in page_details.ngrams) {
    ngram_body += '<div style="width: 33%; float: left;">' + ngram + ' (' + page_details.ngrams[ngram] + ') </div>';
}

document.getElementById('dv_ngrams_content').innerHTML = ngram_body;


