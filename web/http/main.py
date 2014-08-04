from flask import Flask, render_template, send_from_directory, abort, redirect
from services import bookmark as bm
import os

import auth
import bookmark

app = Flask(__name__, static_folder='static', static_url_path='/static')
app.register_blueprint(auth.auth, url_prefix='/auth')
app.register_blueprint(bookmark.bookmark, url_prefix='/bookmarks')
app.secret_key = '1qaz2wsx!'

@app.route('/<url>')
def short_url_redirect(url):

    short_url = '/%s' % url

    _bookmark = bm.get_bookmart_by_short(short_url)

    if _bookmark is None:
        abort(404)

    return redirect(_bookmark['url'])

@app.errorhandler(404)
def not_found(error):
    return render_template('not_found.html'), 404

@app.route('/favicon.ico')
def favicon():
    print os.path.join(app.root_path, 'static')
    return send_from_directory(os.path.join(app.root_path, 'static'),
                'favicon.ico')


@app.route('/')
def home_page_view():
    return render_template(
        'home.html',
    )

if __name__ == "__main__":
    app.run(debug=True, port=5002)
