import click
from flask.cli import with_appcontext

from flask_sqlalchemy import SQLAlchemy
from app.models import User, Category, Income, Expense

@click.command(name='create_tables')
@with_appcontext
def create_tables():
    db = SQLAlchemy()
    db.create_all()