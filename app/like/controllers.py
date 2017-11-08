from flask import Blueprint, jsonify, request, g, session
from app import db
from app.user.models import *
from app.user.controllers import *
from app.photo.models import *
from app.photo.controllers import *
from app.like.models import *

mod_like = Blueprint('like', __name__, url_prefix='/api')


# Your controllers here

@mod_like.route('/like', methods=['POST'])
@requires_auth
def enroll_user_to_photo():
    try:
        user_id = session['user_id']
        photo_id = request.form['photo_id']

        usr = User.query.filter_by(id=user_id)[0]
        pho = Photo.query.filter_by(id=photo_id)[0]
        if usr in pho.subscribers:
            return jsonify({"status": "error"})
        pho.subscribers.append(usr)
        db.session.commit()
        return jsonify({"status": "success"})

    except:
        return jsonify({"status": "error"})
    # raise

@mod_like.route('/likers', methods=['POST'])
def get_likes_of_photo():
    try:
        print("hi")
        photo_id = request.form['photo_id']
        print(photo_id)
        pho = Photo.query.filter_by(id=photo_id)[0]
        arr=[]
        for usr in pho.subscribers:
            print(usr.username)
            arr.append(usr.username)
        return jsonify({"status": "success", "likers": arr})

    except:
        print("NAHH")
        return jsonify({"status": "error"})
    # raise



@mod_like.route('/unlike', methods=['POST'])
@requires_auth
def un_enroll_user_to_photo():
    try:
        user_id = request.form['user_id']
        photo_id = request.form['photo_id']

        usr = User.query.filter_by(id=user_id)[0]
        pho = Photo.query.filter_by(id=photo_id)[0]
        # pho.subscribers.append(usr)
        if usr not in pho.subscribers:
            return jsonify({"status": "error"})

        usr.subscriptions.remove(pho)
        db.session.commit()
        return jsonify({"status": "success"})

    except:
        return jsonify({"status": "error"})
