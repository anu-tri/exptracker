from app import db
from flask_login import UserMixin # Use only for the a USER model
from datetime import datetime as dt, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
import secrets


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(150))
    lastname = db.Column(db.String(150))
    username = db.Column(db.String(200), unique=True, index=True)
    password = db.Column(db.String(200))
    created_on = db.Column(db.DateTime, default=dt.utcnow)
    expenses = db.relationship('Expense', backref='author', lazy='dynamic')
    token = db.Column(db.String, index=True, unique=True)
    token_exp = db.Column(db.DateTime)

    def hash_password(self,original_password):
        return generate_password_hash(original_password)

    def check_hashed_password(self, login_password):
        return check_password_hash(self.password, login_password)

    def get_token(self, exp=86400):
        current_time = dt.utcnow()
        # give the user their token if the token is not expired
        if self.token and self.token_exp > current_time + timedelta(seconds=60):
            return self.token
        # if not a token create a token and exp date
        self.token = secrets.token_urlsafe(32)
        self.token_exp = current_time + timedelta(seconds=exp)
        self.save()
        return self.token

    def revoke_token(self):
        self.token_exp = dt.utcnow() - timedelta(seconds=61)

    @staticmethod
    def check_token(token):
        u = User.query.filter_by(token=token).first()
        if not u or u.token_exp < dt.utcnow():
            return None
        return u

    def from_dict(self, data):
        self.firstname = data["firstname"]
        self.lastname = data["lastname"]
        self.username = data["username"]
        if "password" in data:
            self.password = self.hash_password(data["password"])
    
    def to_dict(self):
        return {
            "id": self.id,
            "firstname": self.firstname,
            "lastname": self.lastname,
            "username": self.username,
            "created_on": self.created_on
        }

    def __repr__(self):
        return f'<{self.id}{self.firstname}{self.lastname}{self.username}>'

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
        

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    description = db.Column(db.String(200))

    def from_dict(self, data):
        self.name = data["name"]
        self.description = data["description"]
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description
        }

    def save(self):
        db.session.add(self)
        db.session.commit()

    def edit(self, new_name, new_description):
        self.name = new_name
        self.description = new_description
        self.save()
    
    def delete(self):
        db.session.delete(self)
        db.session.commit()
    
    def __repr__(self):
        return f'<id:{self.id} | name: {self.name}| description: {self.description[:15]}>'


class Income(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Numeric(9,2))
    month =  db.Column(db.String(50))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    
    def from_dict(self, data):
        self.amount = data["amount"]
        self.month = data["month"]
        self.user_id = data["user_id"]
    
    def to_dict(self):
        return {
            "id": self.id,
            "amount": self.amount,
            "month": self.month,
            "user_id": self.user_id
        }

    def save(self):
        db.session.add(self)
        db.session.commit()

    def edit(self, new_amount, new_month, new_userid):
        self.amount = new_amount
        self.month = new_month
        self.user_id = new_userid
        self.save()
    
    def delete(self):
        db.session.delete(self)
        db.session.commit()
    
    def __repr__(self):
        return f'<id:{self.id} | amount: {self.amount}| month: {self.month} | user_id: {self.user_id}>' 


class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Numeric(8,2))
    description = db.Column(db.String(300))
    year = db.Column(db.Integer, default = dt.utcnow().year)
    month = db.Column(db.String(50))
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'))
    # income_id = db.Column(db.Integer, db.ForeignKey('income.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    date_created = db.Column(db.DateTime, default=dt.utcnow)
    date_updated = db.Column(db.DateTime, onupdate=dt.utcnow)

    def save(self):
        db.session.add(self)
        db.session.commit()
    
    def delete(self):
        db.session.delete(self)
        db.session.commit()
    
    def __repr__(self):
        return f'<id:{self.id} | amount: {self.amount}| year:{self.year} | month:{self.month} | description: {self.description[:15]}>' 

    def from_dict(self, data):
        self.amount = data["amount"]
        self.description = data["description"]
        self.month = data["month"]
        self.category_id = data["category_id"]
        self.user_id = data["user_id"]

    def to_dict(self):
        return {
            "id": self.id,
            "amount": self.amount,
            "description": self.description,
            "month": self.month,
            "category_id": self.category_id,
            "user_id": self.user_id
        }