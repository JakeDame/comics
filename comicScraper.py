#Currently Designed for Local Development and use
# --> Need to change directory paths once pushed onto aws server
# --> Todo: Change URL to match how website uses publisher names
#           (ex: Dark Horse Comic -> dark-horse)
import requests
import urllib.request
import os
site = "http://comics.gocollect.com/new/this/week" 
page = requests.get(site)

#Check if the page downloaded correctly 
#print(page.status_code)

from bs4 import BeautifulSoup
soup = BeautifulSoup(page.content, 'html.parser')

#Create publisher array and set fillList flag to False
findPub = soup.find_all('a', {'class' : 'new_publisher'});
publisherUrl = []
fillList = True
counter = 0
for item in findPub:
  if(counter == 10): #only want the top 10 publishers
    fillList = False
  if(fillList == True):
    publisherUrl.append(item['href'])
    counter += 1

#Start of Publishers for loop <-- Design purposes until implemented
for pub in publisherUrl:
  newSite = pub
  newPage = requests.get(newSite)
  #print("%s %s" % (newSite, newPage.status_code))
  newSoup = BeautifulSoup(newPage.content, 'html.parser')
  
  comicsList= newSoup.find_all("li", {"class": "comic"})
  #print("comicsList Size = %s" % (len(comicsList)))

  for item in comicsList:
    #print(item)
    imgName = item.strong.get_text() + '.png'
    dirName = os.path.dirname(__file__)
    dirPath = os.path.join(dirName, "app/public/images/covers")
    dirPathFinal = os.path.join(dirPath, pub.split('/', 6)[6])
    fullName = os.path.join(dirPathFinal, imgName)
    print(fullName)
    imgUrl = item.img['src']
    urllib.request.urlretrieve(imgUrl, fullName)

#End loop
