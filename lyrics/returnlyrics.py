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

''' getlyricsstring(artist, song) gets the lyrics of a given song by a given
    artist. All newlines are left as '/n'.
'''
def getlyricsstring(artist, song):
    error = "Error: Could not find lyrics."
    global current_service
    for i in range (current_service+1, len(services_list2)):
        lyrics, url = services_list2[i](artist, song)
        current_service = i
        if lyrics != error:
            lyrics = lyrics.replace("&amp;", "&").replace("`", "'").strip()
            break
    return(lyrics, url)

''' listifylyrics(lyrics) takes a string and turns it into a list, separated
    by '/n'. 
'''
def listifylyrics(lyrics):
    lyrics = lyrics.replace("\n\n", "\n") # remove to keep stanzas separated
    lyacc = []
    while ('\n' in lyrics):
        loc = lyrics.find('\n')
        lyacc = lyacc + [lyrics[:loc]]
        lyrics = lyrics[loc+1:]
    return lyacc + [lyrics]

''' getlyrics(artist, song) getes the lyrics of a given song by a given artist
    and returns it as a list of lines as individual strings. 
'''
def getlyrics(artist, song):
    lyricsstring, lyricsurl = getlyricsstring(artist, song)
    return listifylyrics(lyricsstring)
    