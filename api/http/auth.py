from functools import wraps
from flask import  Blueprint, request
from status import finish

auth = Blueprint('auth', __name__, url_prefix='/auth')

def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):

        token = request.form.get('token', request.args.get('token', None))

        if token is None or token != '1':
            return finish({}, 401, 'You are missing the user token or it is invalid')
        return f(*args, **kwargs)
    return decorated

@auth.route('/login', methods=['POST'])
def login():

    #TODO Users
    email = request.form.get('email')
    password = request.form.get('password')

    if email == 'dominic@dplouffe.ca' and password == 'secret':
        token = 1

        return finish({'token': token}, 200)

    return finish({}, 404, msg='Username or Password were not found.')

# @auth.route('/logout')
# def logout():
#     session.pop('_u')

    # return redirect('/')
