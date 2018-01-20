import json 

def jsonextract(filename):
    with open(filename) as json_data:
        d = json.load(json_data)
        return d