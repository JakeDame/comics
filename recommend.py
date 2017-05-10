from pymongo import MongoClient
from collections import defaultdict
from isoweek import Week
import sys, random, datetime

#get command line argument for user
targetUser = sys.argv[1]

#set up mongodb connections and collections
uri = "mongodb://admin:admin123@localhost:27017/comics?authSource=admin"
client = MongoClient(uri)
db = client['comics']
coll = db['collections']
rec = db['recommendedTitles']
users = db['users']

#stored variable setup
usernameArray = []
pubDict = defaultdict(list)
titleDict = defaultdict(list)
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

#Check to see if other users read the same publishers
for user in usernameArray:
  if(user == targetUser):
    continue
  for pub in set(pubDict[user]): 
    specPub = pubDict[user].count(pub)
    pubTot = len(pubDict[user])
    if((pubDict[targetUser].count(pub)>0) and ((specPub/pubTot)>0.25 )):
      rec = random.choice(titleDict[user])
      while(titleDict[targetUser].count(rec) > 0):
        rec = random.choice(titleDict[user])
      recTitles.append(rec)

#get wednesday date => used for lastupdated on recommended titles list
now = datetime.datetime.now()
weekNum = datetime.date(now.year, now.month, now.day).strftime("%V")
weekNum = int(weekNum)
date = Week(now.year, weekNum).wednesday()
date = str(date)

recDict['owner'] = targetUser
recDict['lastUpdated'] = date
