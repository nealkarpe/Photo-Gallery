import os
from flask import Blueprint, request, redirect, url_for, session, jsonify, flash
from app import db, requires_auth
from .models import Photo
from app import app
import random
import string

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif', 'bmp'])


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


mod_photo = Blueprint('photo', __name__, url_prefix='/api')


@mod_photo.route('/photo', methods=['POST'])
@requires_auth
def create_photo():
    try:
        private = True
        privacy_setting = request.form['private']
        print(privacy_setting)
        if privacy_setting == 'private':
            private = True
        else:
            private = False
        print(private)
        user_id = session['user_id']
        photo_id = ''.join(random.choice(string.digits) for _ in range(10))
        photo = Photo(photo_id, private, user_id)

        if 'file' not in request.files:
            print('No file part')

            return jsonify(success=False), 401

        file = request.files['file']

        if file.filename == '':
            print('No selected file')

            return jsonify(success=False), 401

        if file and allowed_file(file.filename):

            ext = file.filename.rsplit('.', 1)[1].lower()
            photoname = str(photo_id) + "." + ext
            temp = app.config['UPLOAD_FOLDER']  # + "/" + str(user_id)
            print(temp)
            print(photoname)
            path = os.path.join(temp, photoname)
            print(path)
            file.save(path)
            path = path.rsplit('/', 3)
            print(path)
            newpath = "/" + path[1] + "/" + path[2] + "/" + path[3]
            print(newpath)
            photo.path = newpath

        else:
            print('file not allowed')
            return jsonify(success=False), 401

        db.session.add(photo)
        db.session.commit()
        return jsonify(success=True, photo=photo.to_dict())

    except:
        raise
        return jsonify(success=False), 401


@mod_photo.route('/photo', methods=['GET'])
@requires_auth
def get_all_photos():
    user_id = session['user_id']
    photos = Photo.query.filter(Photo.user_id == user_id).all()
    return jsonify(success=True, photos=[photo.to_dict() for photo in photos])


@mod_photo.route('/user/<id>', methods=['GET'])
def get_all_public_photos(id):
    user_id = id
    arr = Photo.query.filter(Photo.user_id == user_id).all()
    photos = []
    for i in arr:
        if i.private == False:
            photos.append(i)
    for photo in photos:
        print(photo.private)
        print(type(photo.private))
    return jsonify(success=True, photos=[photo.to_dict() for photo in photos])


@mod_photo.route('/photo/<id>', methods=['GET'])
@requires_auth
def get_photo(id):
    user_id = session['user_id']
    photo = Photo.query.filter(Photo.id == id, Photo.user_id == user_id).first()
    if photo is None:
        return jsonify(success=False), 404
    else:
        return jsonify(success=True, photo=photo.to_dict())


@mod_photo.route('/photo/public/<id>', methods=['GET'])
def get_public_photo(id):
    photo = Photo.query.filter(Photo.id == id).first()
    if photo is None:
        return jsonify(success=False), 404
    elif photo.private == True:
        return jsonify(success=False), 404
    else:
        return jsonify(success=True, photo=photo.to_dict())


@mod_photo.route('/photo/guest/<id>', methods=['GET'])
@requires_auth
def get_guest_photo(id):
    photo = Photo.query.filter(Photo.id == id).first()
    if photo is None:
        return jsonify(success=False), 404
    elif photo.private == True:
        return jsonify(success=False), 404
    else:
        return jsonify(success=True, photo=photo.to_dict())





@mod_photo.route('/photo/<id>', methods=['POST'])
@requires_auth
def edit_photo(id):
    user_id = session['user_id']
    photo = Photo.query.filter(Photo.id == id, Photo.user_id == user_id).first()
    if photo is None:
        return jsonify(success=False), 404
    else:
        privacy_setting = request.form['private']
        if privacy_setting is 'private':
            photo.private = True
        else:
            photo.private = False

    db.session.commit()
    return jsonify(success=True)


@mod_photo.route('/photo/<id>/delete', methods=['POST'])
@requires_auth
def delete_photo(id):
    user_id = session['user_id']
    photo = Photo.query.filter(Photo.id == id, Photo.user_id == user_id).first()
    if photo is None:
        return jsonify(success=False), 404
    else:
        print("heyyyy")
        db.session.delete(photo)
        db.session.commit()
        return jsonify(success=True)
