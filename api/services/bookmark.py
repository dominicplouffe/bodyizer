from pymongo import MongoClient
from datetime import datetime
import shortner

db = MongoClient()['connexion']

def generate_key(short_url, user_id):
    return {
        'short_url': short_url,
        'user_id': user_id
    }

def insert_bookmark(
    title,
    url,
    hostname,
    body,
    ngrams,
    tags,
    user_id
):

    short_url = shortner.get_url(url)
    _id = generate_key(short_url, user_id)

    rec = {
        'title': title,
        'url': url,
        'hostname': hostname,
        'body': body,
        'ngrams': ngrams,
        'tags': [t.strip() for t in tags.split(',')],
        'user_id': user_id,
        'short_url': short_url,
        'created_on': datetime.utcnow(),
        '_id': _id
    }

    db.bookmarks.save(rec)

    return rec

def get_bookmart(short_url, user_id):

    _id = generate_key(short_url, user_id)

    return db.bookmarks.find_one({'_id': _id})
