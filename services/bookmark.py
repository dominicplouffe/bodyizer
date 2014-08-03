from mongodbsearch import mongodbsearch
from config import MONGODB_CONN
from pymongo import MongoClient
from datetime import datetime
import shortner

db = MongoClient(MONGODB_CONN)['connexion']

def generate_key(short_url, user_id):
    return {
        'short_url': short_url,
        'user_id': user_id
    }

def normalize_mongo_key(key):
    return key.replace('.', '_')

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
    created_on = datetime.utcnow()

    rec = {
        'title': title,
        'url': url,
        'hostname': hostname,
        'body': body,
        'ngrams': ngrams,
        'tags': [t.strip() for t in tags.split(',')],
        'user_id': user_id,
        'short_url': short_url,
        'created_on': created_on,
        '_id': _id
    }

    db.bookmarks.save(rec)

    facets = {normalize_mongo_key(facet):1 for facet in ngrams}

    facets[normalize_mongo_key(hostname)] = 1
    mdbs = mongodbsearch.mongodb_search(db)
    mdbs.index_document(
        _id,
        title + ' ' + body,
        facets=facets,
        **{'user_id': user_id, 'created_on': created_on}
    )

    return rec

def get_bookmart(short_url, user_id):

    _id = generate_key(short_url, user_id)

    return db.bookmarks.find_one({'_id': _id})
