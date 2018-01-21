import requests
import json
import urllib
import urllib2

def gifs_from_string(s):
    #  Extract key phrases from string
    #  return corresponding gifs
    #  Request body:
    '''
    {
      "documents": [
        {
          "language": "en",
          "id": "string",
          "text": "The API returns a"
        }
      ]
    }
    '''
    print s
    raw = {}
    raw["text"] = s
    raw["language"] = "en"
    raw["id"] = "string"
    outer = {}
    outer["documents"] = [raw]
    dta = json.dumps(outer)
    file = open("key.txt", 'r')
    key = file.read()
    headers = {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': key[0:(len(key)-1)],
    }
    url = "https://eastus.api.cognitive.microsoft.com" \
          + "/text/analytics/v2.0/keyPhrases"
    r = requests.post(url, data=dta, headers=headers)
    if r.status_code == 200:
        r2 = json.loads(r.text)
        string_2_search = r2["documents"][0]["keyPhrases"]
    else:
        string_2_search = s
    if string_2_search == []:
        string_2_search = s
    print(string_2_search)
    
    # now we get the gifs
    file2 = open("key2.txt", 'r')
    key2 = file2.read()
    
    url_lst = []

    for phrase in string_2_search:
        params = urllib.urlencode({
            'limit': '2',
            'rating': 'pg',
            'lang': 'en',
            'api_key': key2[0:(len(key2)-1)],
            'q': phrase
        })
        r2 = urllib2.urlopen('http://api.giphy.com/v1/gifs/search?' + params)
        r2_read = r2.read()
        r2_load = json.loads(r2_read)
        gif_url = r2_load["data"][0]["embed_url"]
        url_lst.append(gif_url)
    return url_lst

def get_gif_list(stanza_lst):
    # Takes a list of stanzas and returns a list each entry of which is a list of gifs for that stanza
    gifs = []
    for stanza in stanza_lst:
        gif_urls = gifs_from_string(stanza)
        gifs.append(gif_urls)
    return gifs
