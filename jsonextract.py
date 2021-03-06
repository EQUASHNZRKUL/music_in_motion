import json 
import requests


def jsonextract(filename):
    with open(filename) as json_data:
        d = json.load(json_data)
        return d

def get_duration(song_name):
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
    print (song_id_json)
    songs = song_id_json['tracks']['items']
    info_lst = []
    for i in range(0, 4):
        info = {}
        info['title'] = songs[i]['name']
        info['artist'] = songs[i]['artists'][0]['name']
        info['album'] = songs[i]['album']['name']
        info['art'] = songs[i]['album']['images'][2]['url']
        info['uri'] = songs[i]['uri']
        info['id'] = songs[i]['id']
        info_lst.append(info)
    return info_lst
