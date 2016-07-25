from __future__ import unicode_literals
import requests
from requests_oauthlib import OAuth1
from urlparse import parse_qs
import urllib
import json


import os, sys
from flask import Flask,redirect, make_response, render_template,jsonify, request

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
 
  
app = Flask(__name__) 
app.config.from_object(__name__)
app.template_folder = 'frontend/templates'
app.static_folder = 'frontend/static'


REQUEST_TOKEN_URL = "https://api.twitter.com/oauth/request_token"
AUTHORIZE_URL = "https://api.twitter.com/oauth/authorize?oauth_token="
ACCESS_TOKEN_URL = "https://api.twitter.com/oauth/access_token"

CONSUMER_KEY = "RRZ7LXMorcBDLanFRgCqfrvz2"
CONSUMER_SECRET = "1Kt870DVs4CsTySJkWoovqW6JGaxBTJiwgMcGz3vXKtyFZJlBL"

OAUTH_TOKEN = "323959486-J4KVB5JKWyvhfJWTn11AC3KAngfRTAozVsAd4oBJ"
OAUTH_TOKEN_SECRET = "9qpeDz9fKu2ZYzAtbFJISM8dQDp4Iysr2CkGxOE4"


def setup_oauth():
    """Authorize your app via identifier."""
    # Request token
    oauth = OAuth1(CONSUMER_KEY, client_secret=CONSUMER_SECRET)
    r = requests.post(url=REQUEST_TOKEN_URL, auth=oauth)
    credentials = parse_qs(r.content)

    resource_owner_key = credentials.get('oauth_token')[0]
    resource_owner_secret = credentials.get('oauth_token_secret')[0]

    # Authorize
    authorize_url = AUTHORIZE_URL + resource_owner_key
    print 'Please go here and authorize: ' + authorize_url

    verifier = raw_input('Please input the verifier: ')
    oauth = OAuth1(CONSUMER_KEY,
                   client_secret=CONSUMER_SECRET,
                   resource_owner_key=resource_owner_key,
                   resource_owner_secret=resource_owner_secret,
                   verifier=verifier)

    # Finally, Obtain the Access Token
    r = requests.post(url=ACCESS_TOKEN_URL, auth=oauth)
    credentials = parse_qs(r.content)
    token = credentials.get('oauth_token')[0]
    secret = credentials.get('oauth_token_secret')[0]

    return token, secret


def get_oauth():
    oauth = OAuth1(CONSUMER_KEY,
                client_secret=CONSUMER_SECRET,
                resource_owner_key=OAUTH_TOKEN,
                resource_owner_secret=OAUTH_TOKEN_SECRET)
    return oauth



    # if not OAUTH_TOKEN:
    #     token, secret = setup_oauth()
    #     print "OAUTH_TOKEN: " + token
    #     print "OAUTH_TOKEN_SECRET: " + secret
    #     print
    # else:
    #     oauth = get_oauth()

    #     r = requests.get(url="https://api.twitter.com/1.1/trends/place.json?id=23424848", auth=oauth)
    #     print r.json()

@app.route('/')
def home():
    
    return redirect('/dashboard#/home')


@app.route('/dashboard')
def dashboard():

    return make_response(render_template('base.html'))
 


@app.route('/api/list/images')
def images():

    parameter = request.args.to_dict()
    total_req = []

    oauth = get_oauth()
    result = {}
    tempArr = []


    for key in parameter:

        search_term = urllib.quote(parameter[key], safe='')
        #print search_term

        r = requests.get('https://api.twitter.com/1.1/search/tweets.json?q='+search_term, auth=oauth)

        result = json.loads(r.text)

        hashtag = urllib.unquote(parameter[key])

        for i in range(0,len(result['statuses'])):
            tempDict={}

            tempDict['tweet'] = result['statuses'][i]['text']
            tempDict['followers_count'] = result['statuses'][i]['user']['followers_count']
            tempDict['statuses_count'] = result['statuses'][i]['user']['statuses_count']
            tempDict['location'] = result['statuses'][i]['user']['location']
            tempDict['source'] = result['statuses'][i]['source']
            tempDict['hashtag'] = search_term

            if('media' in result['statuses'][i]['entities']):
                tempDict['media_url'] = result['statuses'][i]['entities']['media'][0]['media_url']
                tempDict['media_size'] = 'big'
               

                if('user_mentions' in result['statuses'][i]['entities']):
                    tempDict['user_mentions'] = len(result['statuses'][i]['entities']['user_mentions'])

                

            else:
                tempDict['media_url'] = result['statuses'][i]['user']['profile_image_url']
                tempDict['media_size'] = 'sm'
                #pass

            tempArr.append(tempDict)


    return json.dumps({'data': tempArr})




@app.route('/api/list/trends')
def index():

    oauth = get_oauth()

    r = requests.get(url="https://api.twitter.com/1.1/trends/place.json?id=23424848", auth=oauth)

    return jsonify({'data': r.json()})


if __name__ == "__main__":
    app.run(debug=True)







