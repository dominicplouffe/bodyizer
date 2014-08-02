from flask import Blueprint, request
from services import bookmark as bm
from auth import requires_auth
from status import finish

bookmark = Blueprint('bookmark', __name__, url_prefix='/bookmark')

@bookmark.route('/set', methods=['POST'])
@requires_auth
def set():

    title = request.form.get('title')
    url = request.form.get('url')
    hostname = request.form.get('hostname')
    body = request.form.get('body')
    ngrams = request.form.get('ngrams')
    token = request.form.get('token')
    tags = request.form.get('tags')

    _bookmark = bm.insert_bookmark(
        title,
        url,
        hostname,
        body,
        ngrams,
        tags,
        token
    )

    return finish(
        {'url': _bookmark['short_url']},
        200
    )
