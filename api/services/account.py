from config import PASSWORD_HASH
from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId
from bson.errors import InvalidId
import hashlib

db = MongoClient()['connexion']

def hash_password(password):

    hashed_password = hashlib.sha512(
        password.encode('utf-8') + PASSWORD_HASH.encode('utf-8')
    ).hexdigest()

    return hashed_password

def create_account(email_address, password):

    account = {
        'email_address': email_address,
        'password': hash_password(password),
        'created_on': datetime.utcnow()
    }

    _id = db.accounts.save(account)

    return _id

def validate_account(email_address, password):

    query = {
        'email_address': email_address,
        'password': hash_password(password)
    }

    return db.accounts.find_one(query)

def get_acount_by_id(_id):

    try:
        query = {'_id': ObjectId(_id)}
    except InvalidId:
        return None

    return db.accounts.find_one(query)
