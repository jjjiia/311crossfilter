##make dictionaries for all columns
import csv
import json
import collections
import operator
import sys
import datetime
csv.field_size_limit(sys.maxsize)


#weather headers
#['STATION', 'STATION_NAME', 'DATE', 'MDPR', 'MDSF', 'DAPR', 'DASF', 'PRCP', 'SNWD', 'SNOW', 'PSUN', 'TSUN', 'TMAX', 'TMIN', 'TOBS', 'WT09', 'WT14', 'WT07', 'WT01', 'WT15', 'WT17', 'WT06', 'WT21', 'WT05', 'WT02', 'WT11', 'WT22', 'WT04', 'WT13', 'WT16', 'WT08', 'WT18', 'WT03', 'WT19']

with open('/Users/Jia/Documents/map_crossfilter-gh-pages/nyc_2013_data_temp.csv', 'wb') as newcsvfile:
    spamwriter = csv.writer(newcsvfile)
   # spamwriter.writerow(["date", "tmin", "tmax", "prcp"])
    spamwriter.writerow(["agency", "description", "date","weekday", "hour", "zipcode", "lat", "lng", "borough","month","tmin", "tmax", "prcp"])
    
    weather = []
    with open('/Users/Jia/Documents/map_311/data_processed/nyc_2013temperatures.csv', 'rb') as csvfile:
        
        spamreader = csv.reader(csvfile)
        csvfile.seek(0)
        next(spamreader, None)   
        for row in spamreader:
            weather.append(row)
           
    with open('/Users/Jia/Documents/map_311/data_processed/nyc_2013.csv', 'rb') as csvfile2:
        
        incidentsReader = csv.reader(csvfile2)
        
        csvfile2.seek(0)
        next(incidentsReader, None)   
        
        for row in incidentsReader:
            date = row[2]
            for weatherrow in weather:
                weatherdate = weatherrow[0]
                if date == weatherdate:
                    row.append(date[0:2])
                    row.append(weatherrow[1])
                    row.append(weatherrow[2])
                    row.append(weatherrow[3])
                    spamwriter.writerow(row)