from pymongo import MongoClient
from collections import defaultdict
from isoweek import Week
from bson.son import SON
import sys, random, datetime, pprint

#get command line argument for user
targetUser = sys.argv[1]

#set up mongodb connections and collections
uri = "mongodb://admin:admin123@localhost:27017/comics?authSource=admin"
client = MongoClient(uri)
db = client['comics']
coll = db['collections']
users = db['users']

#stored variable setup
usernameArray = []
pubDict = defaultdict(list)
titleDict = defaultdict(list)
ongoingDict = defaultdict(list)
writerDict = defaultdict(list)
artistDict = defaultdict(list)
recTitles = []
recDict = {}


#fill userArray with usernames
userData = users.find()
for user in userData:
  usernameArray.append(user["local"]["username"])


#fill pubDict and titleDict with collection data
for user in usernameArray:
  for data in coll.find({"owner":user}):
    for data2 in data["books"]:
      titleDict[user].append(data2["title"])
      pubDict[user].append(data2["publisher"])
      ongoingDict[user].append(data2["ongoing"])
      writerDict[user].append(data2["writer"])
      artistDict[user].append(data2["artist"])

#Check to see if other users read the same publishers
for user in usernameArray:
  if(user == targetUser):
    continue
  for pub in set(pubDict[user]): 
    specPub = pubDict[user].count(pub)
    pubTot = len(pubDict[user])
    if((pubDict[targetUser].count(pub)>0) and ((specPub/pubTot)>0.25 )):
      rt = random.choice(titleDict[user])
      while(titleDict[targetUser].count(rt) > 0):
        rt = random.choice(titleDict[user])
      recTitles.append(rt)

#get wednesday date => used for lastupdated on recommended titles list
now = datetime.datetime.now()
weekNum = datetime.date(now.year, now.month, now.day).strftime("%V")
weekNum = int(weekNum)
date = Week(now.year, weekNum).wednesday()
date = str(date)

recDict['owner'] = targetUser
recDict['lastUpdated'] = date
recDict['books'] = []
books = {}


for title in recTitles:
  grabbed = False
  cursor = coll.find({"books.title":title})
  for data in cursor:
    for data2 in data["books"]:
      if(title == data2["title"] and grabbed == False):
        '''
        print(data2["title"])
        print(data2["publisher"])
        print(data2["ongoing"])
        print(data2["writer"])
        print(data2["artist"])
        grabbed = True
        '''
        books['title'] = title
        books['publisher'] = data2["publisher"]
        books['ongoing'] = data2["ongoing"]
        books['writer'] = data2["writer"]
        books['artist'] = data2["artist"]
        grabbed = True
  #check if there's already a recommendedTitles collection for targetUser
  #if one exists update, if not create
  recDict['books'].append(books)
  #pp = pprint.PrettyPrinter(indent=4)
  #print("DICT")
  #pp.pprint(recDict)
  if(db.recommended.find({"owner": targetUser}).count() > 0):
    db.recommended.find_one_and_update({"owner": targetUser} , 
                  { "$push"  : {
                      "books" : {
                        "title" : recDict['books'][0]['title'],
                        "publisher" : recDict['books'][0]['publisher'],
                        "ongoing" : recDict['books'][0]['ongoing'],
                        "writer" : recDict['books'][0]['writer'],
                        "artist" : recDict['books'][0]['artist']
                  } } }, upsert=True )
  else:
    db.recommended.insert_one(recDict.copy())

