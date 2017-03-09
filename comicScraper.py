#Currently Designed for Local Development and use
# --> Need to change directory paths once pushed onto aws server

#imports
import requests, urllib.request, os, datetime, json
from isoweek import Week
from bs4 import BeautifulSoup

#create dictionary to store data to send to the database
comicDict = {}
dataDirName = os.path.dirname(__file__)
dataDirPath = os.path.join(dataDirName, "app/data/comicData.json")
with open(dataDirPath, 'w') as f:
  f.write("{ \"comics\":[")

site = "http://comics.gocollect.com/new/this/week" 
page = requests.get(site)
#print(page.status_code)
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

#Start of Publishers for loop <-- Design purposes until implemented
for pub in publisherUrl:
  #Access the new website
  newSite = pub
  newPage = requests.get(newSite)
  #print("%s %s" % (newSite, newPage.status_code))
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
  #print("comicsList Size = %s" % (len(comicsList)))

  for item in comicsList:
    title = item.strong.get_text()
    comicDict['Title'] = title
    imgName = title + '.png'
    imgName = imgName.split(' ')
    imgName = '_'.join(imgName)
    imgName = imgName.lower()
    comicDict['Cover'] = imgName 

    with open(dataDirPath, 'a') as f:
      json.dump(comicDict, f, indent=3)
      f.write(',\n')

    dirName = os.path.dirname(__file__)
    dirPath = os.path.join(dirName, "app/public/images/covers")
    dirPathFinal = os.path.join(dirPath, pub.split('/', 6)[6])
    fullName = os.path.join(dirPathFinal, imgName)
    #print(fullName)
    imgUrl = item.img['src']
    urllib.request.urlretrieve(imgUrl, fullName)
#End loop

#Finish up the proper json formatting by removing extra , and newline, then
#add the finishing brackets
with open(dataDirPath, 'rb+') as f:
  f.seek(-2, os.SEEK_END)
  f.truncate()
with open(dataDirPath, 'a') as f:
  f.write("]}")


