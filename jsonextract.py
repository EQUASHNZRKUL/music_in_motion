import json 
import requests


def jsonextract(filename):
    with open(filename) as json_data:
        d = json.load(json_data)
        return d

def get_duration(song_name):
    # first we need to authenticate
    # client_id = ...
    # client_secret = ...
    # grant_type = 'client_credentials'
    #Request based on Client Credentials Flow from https://developer.spotify.com/web-api/authorization-guide/
    #Request body parameter: grant_type Value: Required. Set it to client_credentials
    # body_params = {'grant_type' : grant_type}
    # url='https://accounts.spotify.com/api/token'
    # response=requests.post(url, data=body_params, auth = (client_id, client_secret)) 
    # print response

    heads = {}
    file = open("spotify_key.txt", 'r')
    key = file.read()
    heads["authorization"] = "Bearer " + key[0:(len(key)-1)]
    params = {}
    params["q"] = song_name
    params["type"] = "track"
    url = "https://api.spotify.com/v1/search"
    response = requests.request("GET", url, headers=heads, params=params)
    song_id_json = json.loads(response.text)
    return song_id_json['track']['items'][0]['duration']

def get_top_five(song_name):
    heads = {}
    file = open("spotify_key.txt", 'r')
    key = file.read()
    heads["authorization"] = "Bearer " + key
    params = {}
    params["q"] = song_name
    params["type"] = "track"
    url = "https://api.spotify.com/v1/search"
    response = requests.request("GET", url, headers=heads, params=params)
    song_id_json = json.loads(response.text)
    songs = song_id_json['track']['items']
    info_lst = []
    for i in range(0, 4):
        info = {}
        info['track_name'] = songs[i]['name']
        info['artist_name'] = songs[i]['artists'][0]['name']
        info['album_name'] = songs[i]['album']['name']
        info['album_art'] = songs[i]['album']['images'][3]['url']
        info_lst.append(info)
    return info_lst
