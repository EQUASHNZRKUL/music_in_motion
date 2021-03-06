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
    # print s
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
        try:
            string_2_search = r2["documents"][0]["keyPhrases"]
        except:
            string_2_search = [s]
    else:
        string_2_search = [s]
    if string_2_search == []:
        string_2_search = [s]
    # print(string_2_search)
    
    # now we get the gifs
    file2 = open("key2.txt", 'r')
    key2 = file2.read()
    
    url_lst = []

    for phrase in string_2_search:
        if len(phrase.split(" ")) == 1:
            phrase = s
        print "\n The phrase is: "
        print phrase
        # print phrase
        params = urllib.urlencode({
            'limit': '3',
            'rating': 'pg',
            'lang': 'en',
            'api_key': key2[0:(len(key2)-1)],
            'q': phrase.encode('utf-8')
        })
        r2 = urllib2.urlopen('http://api.giphy.com/v1/gifs/search?' + params)
        r2_read = r2.read()
        # print r2_read
        r2_load = json.loads(r2_read)
        for i in range(3):
            try:
                gif_url = r2_load["data"][i]["images"]["original"]["url"]
                gif_frames = r2_load["data"][i]["images"]["original"]["frames"]
                framerate = 15 # assume 15 fps
                duration = int(gif_frames) / framerate
                print "\n The gif url is: "
                print gif_url
                url_lst.append((gif_url, duration))
            except:
                gif_url = ""
                gif_frames = "0"
    return url_lst

def get_gif_list(stanza_lst):
    # Takes a list of stanzas and returns a list each entry of which is a list of gifs for that stanza
    gifs = []
    for stanza in stanza_lst:
        gif_urls = gifs_from_string(stanza)
        gifs.append(gif_urls)
    return gifs

''' wesify_giflist converts a giftuple array (tuples of gifs and their durations)
    and a duration list (list of durations of lines) and returns the list of
    gifs that will be played and their expected durations as a tuple list. 
'''
def wesify_giflist(gifarray, duration_list, start_list):
    wes_list = []
    for i in range(len(duration_list)):
        giflist = gifarray[i]
        if (i >= (len(duration_list)-2)):
            duration_lim = duration_list[i]
        else:
            duration_lim = int(start_list[i+1]) - int(start_list[i])
        duracc = 0
        for giftuple in giflist:
            duration = giftuple[1]
            if (duracc + duration) >= duration_lim: # check if this gif in the list will make it into the video. 
                duration = duration_lim - duracc # gives remainder time to final gif
                wes_list = wes_list + [(giftuple[0], duration)] # add gif and duration to wes_list & finish
                break
            else: # if whole gif fits in designated duration limit
                duracc = duracc + duration # increase duration taken up
                wes_list = wes_list + [(giftuple[0], duration)] # add gif and duration to wes_list & repeat
    return wes_list