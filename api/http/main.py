from flask import Flask
import sys

from api.http import auth, bookmark

app = Flask(__name__, static_folder='static', static_url_path='/static')
app.register_blueprint(auth.auth, url_prefix='/api/v1.0/auth')
app.register_blueprint(bookmark.bookmark, url_prefix='/api/v1.0/bookmark')
# app.register_blueprint(gpx.gpx, url_prefix='/gpx')
# app.register_blueprint(finances.finances, url_prefix='/finances')

app.secret_key = '1qaz2wsx!'

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5001
    app.run(debug=True, port=port)
