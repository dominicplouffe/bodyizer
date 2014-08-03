from flask import  Blueprint, request
from services import account
from functools import wraps
from status import finish

auth = Blueprint('auth', __name__, url_prefix='/auth')

def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):

        token = request.form.get('token', request.args.get('token', None))

        print token
        _acc = None
        if token is not None:
            _acc = account.get_acount_by_id(token)

        if _acc is None:
            return finish(
                {},
                401,
                'You are missing the user token or it is invalid'
            )
        return f(*args, **kwargs)
    return decorated

@auth.route('/login', methods=['POST'])
def login():

    #TODO Users
    email = request.form.get('email')
    password = request.form.get('password')

    _acc = account.validate_account(email, password)
    if _acc is not None:
        token = str(_acc['_id'])
        return finish({'token': token}, 200)

    return finish({}, 404, msg='Username or Password were not found.')
