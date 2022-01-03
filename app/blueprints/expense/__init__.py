from flask import Blueprint

bp = Blueprint('expense', __name__, url_prefix='')

from .import expense_routes