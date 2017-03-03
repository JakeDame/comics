import requests
site = "http://comics.gocollect.com/new/this/week" 
page = requests.get(site)

#Check if the page downloaded correctly 
#print(page.status_code)

from bs4 import BeautifulSoup
soup = BeautifulSoup(page.content, 'html.parser')
#print(soup.prettify())

#Create publisher array and set fillList flag to False
publishers = []
fillList = False
for item in soup.find_all('a'):
  #print(item.get_text())
  if(fillList == True):
    publishers.append(item.get_text())
  if(item.get_text() == "All Publishers"):
    fillList = not fillList

#Grabs the last instance of All Publishers, so pop it off
publishers.pop()

print("SHOULD BE MARVEL")
newSite = site +'/' + publishers[0]
print(newSite)
newPage = requests.get(newSite)
print(newPage.status_code)
newSoup = BeautifulSoup(newPage.content, 'html.parser')

for item in newSoup.p['class']:
  print(item.get_text())


"""
for pub in publishers:
  newSite = site + pub
  newPage = requests.get(newSite)
  print(page.status_code)
"""

