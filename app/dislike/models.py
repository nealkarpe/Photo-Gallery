from flask_sqlalchemy import SQLAlchemy
from app import db

dissubs = db.Table('dissubs',
    db.Column('id', db.Integer, primary_key=True, autoincrement=True),
    db.Column('photo_id', db.Integer, db.ForeignKey('photos.id')),
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'))
    )

