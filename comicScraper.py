import requests
site = "http://comics.gocollect.com/new/this/week" 
page = requests.get(site)

#Check if the page downloaded correctly 
print(page.status_code)

from bs4 import BeautifulSoup
soup = BeautifulSoup(page.content, 'html.parser')
print(soup.prettify())
print("LIST:\n")

#print(list(soup.children))
html = list(soup.children)
counter = 0
for item in html
  print("%s [%d]", item, counter)
  counter++
