from flask import Blueprint, request
from services import bookmark as bm
from services import shortner
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
    token = request.form.get('token')
    tags = request.form.get('tags')
    image = request.form.get('image')

    _bookmark = bm.insert_bookmark(
        title,
        url,
        hostname,
        body,
        tags,
        image,
        token
    )

    return finish(
        {'url': _bookmark['short_url']},
        200
    )

@bookmark.route('/get', methods=['GET'])
@requires_auth
def get():
    url = request.args.get('url')
    token = request.args.get('token')

    short_url = shortner.get_url(url)

    _bookmark = bm.get_bookmark(short_url, token)

    if _bookmark is None:
        return finish({}, 404, "Bookmark not found.")

    return finish(
        {
            'title': _bookmark['title'],
            'url': _bookmark['url'],
            'hostname': _bookmark['hostname'],
            'tags': ','.join(_bookmark['tags']),
            'short_url': _bookmark['short_url'],
            'image': _bookmark.get('image', '')
        },
        200
    )

@bookmark.route('/search', methods=['GET'])
@requires_auth
def search():

    keyword = request.args.get('q', '')
    token = request.args.get('token')

    results = bm.search_bookmarks(token, keyword=keyword)

    bookmarks = [
        {
            'title': b['title'],
            'short_url': b['short_url'],
            'url': b['url'],
            'image': b.get('image', '')
        }
        for b in results['bookmarks']
    ]

    return finish(
        bookmarks,
        200
    )


