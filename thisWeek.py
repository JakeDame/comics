#imports
import datetime
from isoweek import Week

now = datetime.datetime.now()
weekNum = datetime.date(now.year, now.month, now.day).strftime("%V")
weekNum = int(weekNum)
releaseDate = Week(now.year, weekNum).wednesday()
releaseDate = str(releaseDate)
print(releaseDate)
