#Currently Designed for Local Development and use
# --> Need to change directory paths once pushed onto aws server
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
publishers = []
fillList = False
for item in soup.find_all('a'):
  if(fillList == True):
    publishers.append(item.get_text())
  if(item.get_text() == "All Publishers"):
    fillList = not fillList

#Grabs the last instance of All Publishers, so pop it off
publishers.pop()


#Start of Publishers for loop <-- Design purposes until implemented
for pub in publishers:
  newSite = site +'/' + pub
  newPage = requests.get(newSite)
  print("%s %s" % (pub, newPage.status_code))
  newSoup = BeautifulSoup(newPage.content, 'html.parser')
  
  comicsList= newSoup.find_all("li", {"class": "comic"})
  #print("comicsList Size = %s" % (len(comicsList)))

  for item in comicsList:
    imgName = item.strong.get_text() + '.png'
    dirName = os.path.dirname(__file__)
    dirPath = os.path.join(dirName, "covers")
    dirPathFinal = os.path.join(dirPath, pub.replace(' ', ''))
    fullName = os.path.join(dirPathFinal, imgName)
    imgUrl = item.img['src']
    if "no-image" not in imgUrl:
      continue
    else
      urllib.request.urlretrieve(imgUrl, fullName)

#End loop
