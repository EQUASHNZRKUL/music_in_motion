import requests
import json


def gif_from_string(str):
    #  Extract key phrase from string
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
    raw = {}
    raw["text"] = str
    raw["language"] = "en"
    raw["id"] = "string"
    outer = {}
    outer["documents"] = [raw]
    dta = json.loads(outer)
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
        string_2_search = r2["documents"][0]["keyPhrases"][0]
    else:
        string_2_search = ""
    print string_2_search
