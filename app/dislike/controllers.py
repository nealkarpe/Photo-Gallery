from flask import Blueprint, jsonify, request, g, session
from app import db
from app.user.models import *
from app.user.controllers import *
from app.photo.models import *
from app.photo.controllers import *
from app.dislike.models import *

mod_dislike = Blueprint('dislike', __name__, url_prefix='/api')


# Your controllers here

@mod_dislike.route('/dislike', methods=['POST'])
@requires_auth
def disenroll_user_to_photo():
    try:
        user_id = session['user_id']
        photo_id = request.form['photo_id']

        usr = User.query.filter_by(id=user_id)[0]
        pho = Photo.query.filter_by(id=photo_id)[0]
        if usr in pho.dissubscribers:
            return jsonify({"status": "error"})
        pho.dissubscribers.append(usr)
        db.session.commit()
        return jsonify({"status": "success"})

    except:
        return jsonify({"status": "error"})


@mod_dislike.route('/dislikers', methods=['POST'])
def get_dislikes_of_photo():
    try:
        photo_id = request.form['photo_id']
        pho = Photo.query.filter_by(id=photo_id)[0]
        arr=[]
        for usr in pho.dissubscribers:
            print(usr.username)
            arr.append(usr.username)
        return jsonify({"status": "success", "dislikers": arr})

    except:
        return jsonify({"status": "error"})



@mod_dislike.route('/undislike', methods=['POST'])
@requires_auth
def un_disenroll_user_to_photo():
    try:
        user_id = request.form['user_id']
        photo_id = request.form['photo_id']

        usr = User.query.filter_by(id=user_id)[0]
        pho = Photo.query.filter_by(id=photo_id)[0]
        # pho.subscribers.append(usr)
        if usr not in pho.dissubscribers:
            return jsonify({"status": "error"})

        usr.dissubscriptions.remove(pho)
        db.session.commit()
        return jsonify({"status": "success"})

    except:
        return jsonify({"status": "error"})
