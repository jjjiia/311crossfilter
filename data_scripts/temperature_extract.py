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

with open('/Users/Jia/Documents/map_311/data_processed/nyc_2013temperatures.csv', 'wb') as newcsvfile:
    spamwriter = csv.writer(newcsvfile)
    spamwriter.writerow(["date", "tmin", "tmax", "prcp"])

    with open('/Users/Jia/Documents/map_311/data_raw/nyc_weather_371757.csv', 'rb') as csvfile:
        
        spamreader = csv.reader(csvfile)
        #csvfile.seek(0)
       # next(spamreader, None)   
    #    headers = spamreader.next()
    #    column = {}
    #    for h in headers:
    #        column[h] = []
    #    
        for row in spamreader:            
            date = row[2]
            tsun = row[11]
            prcp = row[7]
            tmin = row[13]
            tmax = row[12]
            day = date[6:8]
            month = date[4:6]
            year = date[0:4]
            date = month+day+year
            if year == "2013":  
               # print year
                print date, tmin, tmax, prcp,tsun
                spamwriter.writerow([date, tmin, tmax, prcp, tsun])
    
      #  zipcodes[zipcode] = zipcodes.get(zipcode,0)+1
      #  agencies[agency] = agencies.get(agency,0)+1
      #  descriptions[description] = descriptions.get(description,0)+1
      #  complaints[complaint] = complaints.get(complaint, 0)+1
        #spamwriter.writerow([agency, description, date, weekday, hour, zipcode, lat, lng, borough])
    
       #print name,",",type,",",id,",",created_at,",",zipcode,",",lng,",",lat