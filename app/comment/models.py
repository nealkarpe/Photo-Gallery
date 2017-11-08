from flask_sqlalchemy import SQLAlchemy
from app import db

'''
comsubs = db.Table('comsubs',
    db.Column('id', db.Integer, primary_key=True, autoincrement=True),
    db.Column('photo_id', db.Integer, db.ForeignKey('photos.id')),
    db.Column('user_id', db.Integer, db.ForeignKey('users.id')),
    db.Column('extra_data', db.String(200))
    )
'''
class Comment(db.Model):
    __tablename__='comsubs'
    #id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    photo_id = db.Column(db.Integer, db.ForeignKey('photos.id'), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    extra_data = db.Column(db.String(200))
    comsubscriber = db.relationship("User", backref=db.backref('comsubscriptions'))
    #comsubscription = db.relationship("Photo", backref=db.backref('comsubscribers'))
