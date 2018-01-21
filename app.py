from flask import Flask, render_template, request, json, jsonify
app = Flask(__name__)

@app.route('/')
def hello_world():
  return render_template('index.html')

# Accepts input string from front-end
@app.route('/getSongs', methods=['POST'])
def get_songs():
  song = request.get_json()['songTitle']
  res = json.dumps({"searchResults" : [
    {
      "title" : "What I've Done",
      "art" : "https://i.scdn.co/image/9b5e12a4d057a8b4313842ee481a9d8ea82945cd",
      "uri" : "spotify:track:40riOy7x9W7GXjyGp4pjAv",
      "artist" : "Linkin Park",
      "album" : "Minutes to Midnight",
      "id" : 123123
    },
    {
      "title": "What I've Done - One More Light live",
      "art" : "https://i.scdn.co/image/9b5e12a4d057a8b4313842ee481a9d8ea82945cd",
      "uri" : "spotify:track:0GOJobsbOSIF99y6CGr5o6",
      "artist" : "Linkin Park",
      "album" : "Minutes to Midnight",
      "id" : 12312
    },
      {
      "title": "What I've Done - One More Light live",
      "art" : "https://i.scdn.co/image/9b5e12a4d057a8b4313842ee481a9d8ea82945cd",
      "uri" : "spotify:track:0GOJobsbOSIF99y6CGr5o6",
      "artist" : "Linkin Park",
      "album" : "Minutes to Midnight",
      "id" : 55555
    },
      {
      "title": "What I've Done - One More Light live",
      "art" : "https://i.scdn.co/image/9b5e12a4d057a8b4313842ee481a9d8ea82945cd",
      "uri" : "spotify:track:0GOJobsbOSIF99y6CGr5o6",
      "artist" : "Linkin Park",
      "album" : "Minutes to Midnight",
      "id" : 55555
    }
  ]})
  return res

@app.route('/getGifs', methods=['POST'])
def get_gifs():
  title = request.get_json()['songId']
  gifdata = youtube_lyrics.search_video(title)
  giflist = get_gif.wesify_giflist(gifdata[0], gifdata[1])
  res = json.dumps({"gifs" : giflist})
  return res

if __name__ == '__main__':
  app.run(debug=True)

