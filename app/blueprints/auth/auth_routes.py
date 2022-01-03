from .import bp as api
from flask import g, make_response, request
from app.models import User
from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth

basic_auth = HTTPBasicAuth()
token_auth = HTTPTokenAuth()


@basic_auth.verify_password
def verify_password(username, password):
    u = User.query.filter_by(username = username).first()
    if u is None:
        return False
    g.current_user = u
    return u.check_hashed_password(password)


@token_auth.verify_token
def verify_token(token):
    u = User.check_token(token) if token else None
    g.current_user = u
    return g.current_user or None


@api.get('/token')
@basic_auth.login_required()
def get_token():
    user = g.current_user
    current_userid = user.id
    print(current_userid)
    token = user.get_token()
    return make_response({"token":token, "current_userid":current_userid}, 200)


@api.get('/user')
def get_users():
    return make_response({"users":[user.to_dict() for user in User.query.all()]}, 200)


@api.get('/user/<int:id>')
@token_auth.login_required()
def get_user(id):
    return make_response(User.query.get(id).to_dict(), 200)


# register user
@api.post('/user')
def post_user():
    data = request.get_json()
    new_user = User()
    new_user.from_dict(data)
    new_user.save()
    return make_response("User created", 200)

@api.put('/user/<int:id>')
# @token_auth.login_required()
def put_user(id):
    data = request.get_json()
    user = User.query.get(id)
    user.from_dict(data)
    user.save()
    return make_response("User modified", 200)

@api.delete('/user/<int:id>')
@token_auth.login_required
def delete_user(id):
    User.query.get(id).delete()
    return make_response("User deleted", 200)