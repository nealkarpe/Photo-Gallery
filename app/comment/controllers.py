from tokenize import Comment

from flask import Blueprint, jsonify, request, g, session
from app import db
from app.user.models import *
from app.user.controllers import *
from app.photo.models import *
from app.photo.controllers import *
from app.comment.models import *

mod_comment = Blueprint('comment', __name__, url_prefix='/api')


# Your controllers here

@mod_comment.route('/comment', methods=['POST'])
@requires_auth
def comenroll_user_to_photo():
    try:
        user_id = session['user_id']
        photo_id = request.form['photo_id']
        comstring = request.form['comstring']
        print(user_id)
        print(photo_id)
        print(comstring)
        usr = User.query.filter_by(id=user_id)[0]
        pho = Photo.query.filter_by(id=photo_id)[0]
        # print(usr.id)
        # print(pho.id)
        # print(comstring)
        # com = Comment(user_id, photo_id, comstring)

        a = Comment(extra_data=comstring)
        a.comsubscriber = usr
        pho.comsubscribers.append(a)

        # pho.comsubscribers.append(usr, extra_data=comstring)
        # pho.comsubscribers.append(com)
        db.session.commit()
        return jsonify({"status": "success"})

    except:
        return jsonify({"status": "error"})
