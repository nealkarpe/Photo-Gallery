from flask_sqlalchemy import SQLAlchemy
from app import db

class Photo(db.Model):
    __tablename__ = 'photos'
    id = db.Column(db.String(10000), primary_key=True)
    path = db.Column(db.String(200), unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    private = db.Column(db.Boolean)
    comsubscribers = db.relationship("Comment", backref=db.backref('comsubscription'))

    def __init__(self, id, private, user_id):
        self.id=id
        self.private = private
        self.user_id = user_id

    def to_dict(self):
        return {
            'id': self.id,
            'path': self.path,
            'private': self.private,
        }

    def __repr__(self):
        return "Photo<%d> %s" % (self.id, self.path) 
