function get_title() {
    var header = document.getElementsByTagName('h1');

    if (header.length === 0) {
        return document.getElementsByTagName('title')[0].innerText;
    }

    return header[0].innerText;
}