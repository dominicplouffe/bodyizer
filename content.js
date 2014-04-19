

var BAD_TAGS = /editor|comment|rss|pagination|footer|header|popup/i;
var INVALID_TAGS = /form|img|script|combx|comment|community|disqus|extra|foot|header|menu|remark|rss|shoutbox|sidebar|sponsor|ad-break|agegate|pagination|pager|popup|tweet|twitter/i;
var VALID_TAGS = ["P", "TD", "PRE"];
var INVALID_INNER_DIV_TAGS = /<(a|blockquote|dl|div|ol|p|pre|table|ul)/i;

function get_possible_elements() {
    var elements = document.getElementsByTagName('*');

    nodes_to_validate = [];
    for (var i = 0; i < elements.length; i++) {
        var el = elements[i];

        tag_name = el.tagName;
        if (tag_name.search(INVALID_TAGS) === -1) {
            if (VALID_TAGS.indexOf(tag_name) !== -1) {
                nodes_to_validate.push(el);
            }
            else if (tag_name === 'DIV') {
                if (!is_bad_element(el)) {
                    nodes_to_validate.push(el);
                }
            }
        }
    }

    return nodes_to_validate;
}

function is_bad_element(el, debug) {


    if (el === null) {
        return true;
    }

    if (el.innerHTML === undefined) {
        return true;
    }

    if (el.innerHTML.search(INVALID_INNER_DIV_TAGS) !== -1) {
        return true;
    }

    var id_class = el.id + '_' + el.className;
    var parent_el = el.parentNode;

    if (id_class.search(BAD_TAGS) !== -1) {
        return true;
    }

    return false;
}

function score_possible_elements(possible_elements) {

    var chosen_element = null;

    for (var i = 0; i < possible_elements.length; i++)
    {
        var el = possible_elements[i];
        var parent_el = el.parentNode;
        var grand_parent_el = parent_el ? parent_el.parentNode : null;
        var inner_text = el.innerText;

        if (inner_text === undefined) {
            continue;
        }

        if (parent_el === undefined || parent_el === null) {
            continue;
        }

        if (parent_el.tagName === 'undefined') {
            continue;
        }

        if (inner_text.length < 50) {
            continue;
        }

        var score = 0;
        score += Math.min(Math.floor(inner_text.length / 100), 3);

        score += inner_text.split(',').length;
        score +- inner_text.split(';').length;
        score += inner_text.split('?').length;

        if (el.body_score === undefined) {
            el.body_score = score;
        } else {
            el.body_score += score;
        }

        if (parent_el.body_score === undefined) {
            parent_el.body_score = score;
        } else {
            parent_el.body_score += score;
        }

        if (chosen_element === null) {
            chosen_element = parent_el;
        } else if (el.body_score > chosen_element.body_score) {
            chosen_element = el;
        }

        if (parent_el.body_score > chosen_element.body_score) {
            chosen_element = parent_el;
        }

        if (grand_parent_el.body_score > chosen_element.body_score) {
            chosen_element = grand_parent_el;
        }
    }

    console.log(chosen_element);
    console.log(is_bad_element(chosen_element));

    return chosen_element;
}

function create_bodyizer_element(best_element) {

    el = document.createElement("DIV");

    if (best_element === null) {
        el.innerHTML = "bodyizer could not find any suitable element to showcase!";
    } else {
        el.innerHTML = best_element.innerHTML;
    }
    el.id = "bodyizer_div";

    document.body.appendChild(el);

    var elw = el.offsetWidth;
    var ww = window.innerWidth;
    var div_left = (ww - elw) / 2;
    el.style.left = div_left + "px";
    el.style.top = "10px";
}

function hide_div(e) {

    function is_bodyizer(el) {
        if (el.id !== undefined) {
            if (el.id.search('bodyizer_div') !== -1) {
                return true;
            }
        }

        if (el.parentNode === undefined || el.parentNode === null || el.parentNode.tagName === "BODY") {
            return false;
        }

        return is_bodyizer(el.parentNode);
    }

    if (!is_bodyizer(e.toElement)) {
        document.getElementById('bodyizer_div').style.display = "none";
    }
}

function display_bodyizer_element() {

    var el = document.getElementById('bodyizer_div');

    if (el !== null) {
        el.style.display = "block";
        return;
    }

    nodes_to_validate = get_possible_elements();
    best_element = score_possible_elements(nodes_to_validate);

    create_bodyizer_element(best_element);
    document.onclick = hide_div;

    parse_ngrams();

    return false;
}

function parse_ngrams() {
    console.log('Parsing Ngrams');

    var el = document.getElementById('bodyizer_div');
    var text = el.innerText;
    var mongograms = text.match(/\w+/g);

    monogram_counts = {};
    for (var i = 0; i < mongograms.length; i++) {
        monogram = mongograms[i].toLocaleLowerCase();

        if (monogram_counts[monogram] === undefined) {
            monogram_counts[monogram] = 0;
        }

        monogram_counts[monogram] += 1;
    }

    console.log(monogram_counts);
}

function init() {
    var head = document.getElementsByTagName('HEAD')[0];

    var style = document.createElement('STYLE');
    style.innerText = "#bodyizer_div { color: black; border: 5px solid #ccc; font-size: 20px; padding: 10px; line-height: 26px; font-family: Georgia; background-color: #FFF; width: 80%; margin: auto; margin-top: 10px; z-index: 999999; position: absolute }";
    style.innerText += "#bodyizer_div p { margin-bottom: 20px; color: black; font-size: 20px; padding: 0px; line-height: 26px; font-family: Georgia; }";
    style.innerText += "#bodyizer_div a { color: red; font-size: 20px; }";
    style.innerText += "#bodyizer_div_link { position: fixed; bottom: 0; right: 0; padding: 5px; border: 1px solid #ddd; background-color: #eee; font-size: 12px; font-family: Georgia; }";
    style.innerText += "#bodyizer_div_link a { color: red; font-size: 12px; font-family: Georgia; }";
    head.appendChild(style);

    var show_div = document.createElement('DIV');
    show_div.id = "bodyizer_div_link";
    show_div.innerHTML = "<a href='#' id='bodyizer_div_link_anchor'>..: Show Bodyizer :..</a>";

    document.body.appendChild(show_div);
    document.getElementById('bodyizer_div_link_anchor').onclick = display_bodyizer_element;
}

init();
