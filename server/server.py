from flask import Flask, jsonify, abort, make_response, request, send_file
from flask_cors import CORS
from PIL import Image, ImageDraw
from natsort import natsorted
from google.cloud import storage
import datetime
import json
import base64
import io
import glob
import os
import shutil


api = Flask(__name__)
CORS(api)


@api.route('/')
def hello():
    name = "Hello, world!"
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

        background.save("./FaceIcon/{}.png".format(i), format="PNG")
        im.append(background)

    files = natsorted(glob.glob('./FaceIcon/*.png'))
    images = list(map(lambda file: Image.open(file), files))
    images[0].save('face.gif', save_all=True,
                   optimize=False,
                   append_images=images[1:],
                   duration=(1/30) * 1000,
                   loop=0
                   )

    shutil.rmtree("./FaceIcon/")

    # GCEの環境の場合は認証は不要
    # os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = './EmotionExpression-5c731e905750.json'
    client = storage.Client()
    # https://console.cloud.google.com/storage/browser/[bucket-id]/
    bucket = client.get_bucket('faceicons')
    blob = bucket.blob('face_{}.gif'.format(datetime.datetime.now()))
    blob.upload_from_filename(filename='face.gif')

    result = {'result': '200'}
    return result


if __name__ == '__main__':
    api.run(host='0.0.0.0', port=80)
