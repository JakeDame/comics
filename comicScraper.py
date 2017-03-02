import requests
site = "http://comics.gocollect.com/new/this/week" 
page = requests.get(site)

#Check if the page downloaded correctly 
print(page.status_code)

from bs4 import BeautifulSoup
soup = BeautifulSoup(page.content, 'html.parser')
print(soup.prettify())

print("FIND SOME SHIT")
publishers = []
for item in soup.find_all('a'):
  if(item.get_text() == "All Publishers")
    counter = 0
    
