from mongodbsearch import mongodbsearch
from config import MONGODB_CONN
from pymongo import MongoClient
from datetime import datetime
import shortner
import re

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
    tags,
    user_id
):

    short_url = shortner.get_url(url)
    _id = generate_key(short_url, user_id)
    created_on = datetime.utcnow()
    title = title.title()

    tags = re.findall('\w+', tags)
    tags.sort()

    rec = {
        'title': title,
        'url': url,
        'hostname': hostname,
        'body': body,
        'tags': tags,
        'user_id': user_id,
        'short_url': short_url,
        'created_on': created_on,
        '_id': _id
    }

    db.bookmarks.save(rec)

    facets = {
        'tags': tags,
        'hostname': [hostname]
    }

    rec.pop('_id')

    mdbs = mongodbsearch.mongodb_search(db)
    mdbs.index_document(
        '%s_%s' % (short_url, user_id),
        '%s %s %s' % ('connexion', title, body),
        facets=facets,
        **rec
    )

    return rec

def get_bookmark(short_url, user_id):

    _id = generate_key(short_url, user_id)

    return db.bookmarks.find_one({'_id': _id})

def get_bookmart_by_short(short_url):

    return db.bookmarks.find_one({'_id.short_url': short_url})

def delete_bookmark(short_url, user_id):

    _id = generate_key(short_url, user_id)

    db.bookmarks.remove({'_id': _id})
    db.documents.remove({'_id': '%s_%s' % (short_url, user_id)})

def search_bookmarks(user_id, keyword=''):
    mdbs = mongodbsearch.mongodb_search(db)

    if keyword is None:
        keyword = 'connexion'

    tags = re.findall('tags:([^$]+)', keyword)
    keyword = re.sub('tags:([^$]+)', '', keyword)
    if len(keyword.strip()) == 0:
        keyword = 'connexion'

    fields = [
        'title',
        'url',
        'short_url',
        'created_on',
        'tags',
        'hostname'
    ]

    conditions = {'user_id': user_id}

    if len(tags) > 0:
        tags = tags[0].split(',')
        conditions['facets.tags'] = {'$all': tags}

    scoring = None
    if keyword == 'connexion':
        scoring = ('created_on', -1)

    results = mdbs.search(
        keyword,
        conditions=conditions,
        fields=fields,
        scoring=scoring
    )

    hostnames = results[1].get('hostname', {}).items()
    hostnames.sort(key=lambda x: x[1], reverse=True)

    tags = results[1].get('tags', {}).items()
    tags.sort(key=lambda x: x[1], reverse=True)

    facets = {
        'hostname': hostnames,
        'tags': tags
    }

    return {
        'bookmarks': results[0],
        'facets': facets,
        'bookmark_count': results[2]
    }
