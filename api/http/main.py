from flask import Flask

import auth
import bookmark

app = Flask(__name__, static_folder='static', static_url_path='/static')
app.register_blueprint(auth.auth, url_prefix='/api/v1.0/auth')
app.register_blueprint(bookmark.bookmark, url_prefix='/api/v1.0/bookmark')
# app.register_blueprint(gpx.gpx, url_prefix='/gpx')
# app.register_blueprint(finances.finances, url_prefix='/finances')

app.secret_key = '1qaz2wsx!'

if __name__ == "__main__":
    app.run(debug=True, port=5001)
