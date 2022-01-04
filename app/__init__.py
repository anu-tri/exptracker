from flask import Flask, send_from_directory
from flask.helpers import send_from_directory
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_moment import Moment
# from flask_cors import CORS
import logging


db = SQLAlchemy()
migrate = Migrate()
moment = Moment()
# cors = CORS()

def create_app(config_class=Config):
    app = Flask(__name__, static_folder="../client/build", static_url_path='')
    app.config.from_object(config_class)
    db.init_app(app)
    migrate.init_app(app,db)
    moment.init_app(app)
    # cors.init_app(app)
    
    app.logger.addHandler(logging.StreamHandler())
    app.logger.setLevel(logging.ERROR)

    @app.route('/')
    def serve():
        return send_from_directory(app.static_folder,'index.html')

    @app.errorhandler(404)
    def not_found(e):
        return app.send_static_file('index.html')

    @app.route("/favicon.ico")
    def favicon():
        return "", 200

    from .blueprints.auth import bp as auth_bp
    app.register_blueprint(auth_bp)

    from .blueprints.expense import bp as expense_bp
    app.register_blueprint(expense_bp)

    return app
