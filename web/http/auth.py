from flask import session, redirect, Blueprint, render_template, request
from services import account
from functools import wraps

auth = Blueprint('auth', __name__, url_prefix='/auth')

def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if not session.has_key('_u'):
            return redirect('/auth/login?redirect=%s' % request.path)
        return f(*args, **kwargs)
    return decorated

@auth.route('/login')
def login():

    redirect_url = request.args.get('redirect', '')
    return render_template('login.html', redirect_url=redirect_url)

@auth.route('/login/check', methods=['POST'])
def check():
    email = request.form.get('email')
    password = request.form.get('password')
    redirect_url = request.form.get('redirect', '/bookmarks')

    _acc = account.validate_account(email, password)
    if _acc is not None:
        session['_u'] = str(_acc['_id'])
        return redirect(redirect_url)

    return render_template(
        'login.html',
        error='Username or Password were not found.'
    )

@auth.route('/logout')
def logout():
    session.pop('_u')

    return redirect('/')
