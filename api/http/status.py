from flask import jsonify

def finish(result, status, msg='Okay'):
    resp = jsonify({
        'status': status,
        'result': result,
        'msg': msg
    })

    resp.status_code = status

    return resp
