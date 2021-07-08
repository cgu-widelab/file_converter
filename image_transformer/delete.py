import json
import os

target_dir = '/share/useless/'
useless = []
try:
    useless = os.listdir(target_dir)
except FileNotFoundError:
    os.mkdir(target_dir)
finally:
    for file in useless:
        os.remove(os.path.join(target_dir, file))
