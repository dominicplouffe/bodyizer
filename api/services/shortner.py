import math

BASE = 62
UPPERCASE_OFFSET = 55
LOWERCASE_OFFSET = 61

def _ord(char):

    if char.isdigit():
        return int(char)
    elif 'A' <= char <= 'Z':
        return ord(char) - UPPERCASE_OFFSET

    return ord(char) - LOWERCASE_OFFSET

def convert_to_int(_str):
    _sum = 0
    l = list(_str)
    l.reverse()

    for idx, char in enumerate(l):
        _sum += _ord(char) * int(math.pow(BASE, idx))

    return _sum

def _chr(num):

    if num < 10:
        return str(num)
    elif 10 <= num <= 35:
        return chr(num + UPPERCASE_OFFSET)

    return chr(num + LOWERCASE_OFFSET)

def convert_to_base(num):

    if num == 0:
        return '0'

    _str = ''
    while num > 0:
        remainder = num % BASE
        _str = _chr(remainder) + _str
        num /= BASE
    return _str

def get_url(url):
    num = abs(hash(url))

    return '/%s' % convert_to_base(num)


if __name__ == '__main__':

    i = abs(hash('http://www.pythoncentral.io/hashing-strings-with-python/'))
    short = convert_to_base(i)

    print convert_to_int(short), i
