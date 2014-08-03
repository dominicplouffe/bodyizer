from flask import session, redirect, Blueprint, render_template, request
from services import bookmark as bm
from auth import requires_auth

bookmark = Blueprint('bookmark', __name__, url_prefix='/bookmarks')

@bookmark.route('/', methods=['GET'])
@requires_auth
def bookmarks():

    keyword = request.args.get('q', '')

    results = bm.search_bookmarks(session['_u'], keyword=keyword)

    return render_template(
        'bookmarks.html',
        bookmarks=results['bookmarks'],
        facets=results['facets'],
        bookmark_count=results['bookmark_count'],
        keyword=keyword if keyword != 'connexion' else None,
        enumerate=enumerate,
        len=len
    )

@bookmark.route('/delete', methods=['GET'])
@requires_auth
def delete():

    _id = request.args.get('id')

    short_url = _id.split('_')[0]
    user_id = _id.split('_')[1]

    bm.delete_bookmark(short_url, user_id)

    return redirect('/bookmarks')

