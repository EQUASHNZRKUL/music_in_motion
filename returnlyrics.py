from bs4 import BeautifulSoup
import requests
import urllib
import time
import os
import sys
import re
import lyrics as minilyrics
import services as s

services_list2 = [s._wikia, s._musixmatch, s._songmeanings, s._songlyrics, s._genius, s._versuri]

artist = ""
song = ""
url = ""

current_service = -1

def main(artist, song):
    error = "Error: Could not find lyrics."
    global current_service
    for i in range (current_service+1, len(services_list2)):
        lyrics, url = services_list2[i](artist, song)
        current_service = i
        if lyrics != error:
            lyrics = lyrics.replace("&amp;", "&").replace("`", "'").strip()
            break
    return(lyrics, url)
    