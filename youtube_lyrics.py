import requests
import re
import urllib
import urllib2
from bs4 import BeautifulSoup
import get_gif

def get_lyrics(id):
    r = requests.get("http://video.google.com/timedtext?lang=en&"+ id)
    text = r.text

    # first separate the lines
    lines = text.split(">")
    p = re.compile('[a-zA-Z0-9_]*\<\/text')
    new_list = filter(p.search, lines)
    lst = [s[:-6] for s in new_list]

    # second separate the duration values
    p2 = re.compile('dur=[a-zA-Z0-9_]*')
    new_list2 = filter(p2.search, lines)
    new_list2 = [s[(s.find("dur=")+5):-1] for s in new_list2]
    return (lst, new_list2)

def search_video(name):
    query = urllib.quote(name)
    url = "https://www.youtube.com/results?sp=EgIoAQ%253D%253D&search_query=" + query
    response = urllib2.urlopen(url)
    html = response.read()
    soup = BeautifulSoup(html)
    vid['href'] = soup.findAll(attrs={'class':'yt-uix-tile-link'})[0]
    vid_l = vid.replace("/watch?", "")
    (lines, durations) = get_lyrics(vid_l)
    gifs = get_gif.get_gif_list(lines)
    return (gifs, durations) # returns (list of list of gifs, list of durations)
