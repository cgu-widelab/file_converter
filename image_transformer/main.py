from flask import (
    Flask,
    request,
)

from flask_cors import CORS

from PIL import Image

app = Flask(__name__)
CORS(app, origins="http://127.0.0.1:8080")

def Converter(imagePath, imageName, imageFormat, ConvertFormat, savePath):
    if not savePath.endswith("/"):
        savePath += "/"
    print("savePath : " + savePath)
    if (imageFormat != 'gif') and ((ConvertFormat == 'jpg') or (ConvertFormat == 'png') or (ConvertFormat == 'bmp') or (
            ConvertFormat == 'tga') or (ConvertFormat == 'gif')):
        im = Image.open(imagePath)
        im = im.convert("RGB")
        im.save(savePath + imageName + '.' + ConvertFormat)
    if (imageFormat != 'gif') and (ConvertFormat == 'tif'):
        im = Image.open(imagePath)
        im = im.convert("RGB")
        im.save(savePath + imageName + '.' + ConvertFormat, compression=None)
    if (imageFormat != 'gif') and (ConvertFormat == 'ico'):
        im = Image.open(imagePath)
        new_im = Image.new("RGBA", im.size)
        new_im.paste(im)
        new_im.save(savePath + imageName + '.' + ConvertFormat)
    if imageFormat == 'gif':
        im = Image.open(imagePath)
        palette = im.getpalette()
        counter = 0
        try:
            while True:
                im.putpalette(palette)
                if ConvertFormat != 'ico':
                    new_im = Image.new("RGB", im.size)
                else:
                    new_im = Image.new("RGBA", im.size)
                new_im.paste(im)
                new_im.save(savePath + imageName + str(counter) + '.' + ConvertFormat)
                counter += 1
                im.seek(im.tell() + 1)
        except EOFError:
            pass  # end of sequence


@app.route('/image_convert')
def image_convert():
    print(request.args.get('name'))
    print(request.args.get('before_format'))
    print(request.args.get('after_format'))
    print(request.args.get("save_path"))
    name = request.args.get('name')
    before_format = request.args.get('before_format').lower()
    after_format = request.args.get('after_format').lower()
    save_path = request.args.get("save_path")

    if save_path is None:
        save_path = "/share/"
    Converter(f"/share/{name}", name, before_format, after_format, save_path)
    return "success"
