#imports
import requests, urllib.request, os, datetime
from isoweek import Week
from bs4 import BeautifulSoup
from pymongo import MongoClient

uri = "mongodb://admin:admin123@localhost:27017/comics?authSource=admin"
client = MongoClient(uri)
db = client['comics']
books = db['comicBooks']

#create dictionary to store data to send to the database
comicDict = {}

site = "http://comics.gocollect.com/new/this/week" 
page = requests.get(site)
soup = BeautifulSoup(page.content, 'html.parser')

#Create publisherUrl array, counter to ensure only the top 10 publishers are grabbed, and set fillList flag to False
publisherUrl = []
fillList = True
counter = 0

#find the publishers to fill publisherUrl with
findPub = soup.find_all('a', {'class' : 'new_publisher'});
for item in findPub:
  if(counter == 10): #only want the top 10 publishers
    fillList = False
  if(fillList == True):
    publisherUrl.append(item['href'])
    counter += 1

#Get date to fill releaseDate parameter in dictionary
now = datetime.datetime.now()
weekNum = datetime.date(now.year, now.month, now.day).strftime("%V")
weekNum = int(weekNum)
releaseDate = Week(now.year, weekNum).wednesday()
releaseDate = str(releaseDate)
comicDict['ReleaseDate'] = releaseDate

#Start of Publishers for loop
for pub in publisherUrl:
  #Access the new website
  newSite = pub
  newPage = requests.get(newSite)
  newSoup = BeautifulSoup(newPage.content, 'html.parser')

  #Start to get data to fill dictionary with
  pubName = pub.split('/', 6)[6]
  folderName = pubName
  if(pubName.find('-') != -1):
    pubName = pubName.split('-')
    pubName = ' '.join(pubName)
    pubName = pubName.title()
  elif((pubName.find('dc') != -1) or (pubName.find('idw') != -1)):
    pubName = pubName.upper()
  else:
    pubName = pubName.title()

  comicDict['Publisher'] = pubName
  comicDict['Folder'] = folderName

  
  #Get list of comics displayed on newSite
  comicsList= newSoup.find_all("li", {"class": "comic"})

  for item in comicsList:
    title = item.strong.get_text()
    comicDict['Title'] = title
    imgName = title.split('#')
    imgName = ''.join(imgName)
    imgName = imgName + '.png'
    imgName = imgName.split(' ')
    imgName = '_'.join(imgName)
    imgName = imgName.lower()
    comicDict['Cover'] = imgName 

    dirName = os.path.dirname(__file__)
    dirPath = os.path.join(dirName, "app/public/images/covers")
    dirPathFinal = os.path.join(dirPath, pub.split('/', 6)[6])
    fullName = os.path.join(dirPathFinal, imgName)
    imgUrl = item.img['src']

    #Dont want to download duplicate covers or add duplicate documents
    if(books.find({"Cover": imgName}).count() < 1):
      #if there's no image from the website
      if(imgUrl.find('no-item-image') == -1):
        urllib.request.urlretrieve(imgUrl, fullName)
      books.insert(comicDict.copy())

#End loop
