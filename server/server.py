from flask import Flask, jsonify, abort, make_response, request, send_file
from flask_cors import CORS
from PIL import Image, ImageDraw
from natsort import natsorted
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
# from firebase_admin import storage
from google.cloud import storage
import datetime
import base64
import io
import glob
import os
import shutil
import hashlib


api = Flask(__name__)
CORS(api)


@api.route('/')
def hello():
    name = "Hello, world"
    return name


@api.route('/returnGIF', methods=['POST'])
def returnGIF():
    image_line = request.form['base64Images']
    imagesBase64 = image_line.split(',')
    imagesBase64.pop()

    im = []
    os.mkdir("./FaceIcon")
    for i, im64 in enumerate(imagesBase64):
        im_b = base64.b64decode(im64)
        inst = io.BytesIO(im_b)
        img = Image.open(inst)

        background = Image.new("RGB", img.size, (255, 255, 255))
        background.paste(img, mask=img.split()[3])

        background.save("./FaceIcon/{}.gif".format(i), format="GIF")
        im.append(background)

    files = natsorted(glob.glob('./FaceIcon/*.gif'))
    images = list(map(lambda file: Image.open(file), files))
    # Animationの間隔設定：基本３０fpsで最後は少し時間を長く
    durations = []
    gif_interval = (1/15) * 1000
    for i in range(len(images)):
        if i == len(images) - 1:
            durations.append(1000)
        else:
            durations.append(gif_interval)

    images[0].save('face.gif', save_all=True,
                   optimize=True,
                   append_images=images[1:],
                   duration=durations,
                   loop=0
                   )

    shutil.rmtree("./FaceIcon/")

    gif_name = 'face-{}.gif'.format(
        hashlib.sha224(datetime.datetime.now().strftime(
            "%Y-%m-%d-%H:%M:%S.%f").encode('utf-8')).hexdigest()
    )

    # GCEの環境の場合は認証は不要
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = './EmotionExpression-5c731e905750.json'
    client = storage.Client()
    bucket = client.get_bucket('faceicons')
    blob = bucket.blob(gif_name)
    blob.upload_from_filename(filename='face.gif')

    result = {'result': '200', 'image_name': gif_name}
    return result


if __name__ == '__main__':
    host = os.getenv('HOST', '0.0.0.0')
    port = int(os.getenv('PORT', '5000'))
    api.run(host=host, port=port)
