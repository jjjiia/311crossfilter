##make dictionaries for all columns
import csv
import json
import collections
import operator
import sys
import datetime
csv.field_size_limit(sys.maxsize)


##['Unique Key', 'Created Date', 'Closed Date', 'Agency', 'Agency Name', 'Complaint Type', 'Descriptor', 'Location Type', 'Incident Zip', 'Incident Address', 'Street Name', 'Cross Street 1', 'Cross Street 2', 'Intersection Street 1', 'Intersection Street 2', 'Address Type', 'City', 'Landmark', 'Facility Type', 'Status', 'Due Date', 'Resolution Action Updated Date', 'Community Board', 'Borough', 'X Coordinate (State Plane)', 'Y Coordinate (State Plane)', 'Park Facility Name', 'Park Borough', 'School Name', 'School Number', 'School Region', 'School Code', 'School Phone Number', 'School Address', 'School City', 'School State', 'School Zip', 'School Not Found', 'School or Citywide Complaint', 'Vehicle Type', 'Taxi Company Borough', 'Taxi Pick Up Location', 'Bridge Highway Name', 'Bridge Highway Direction', 'Road Ramp', 'Bridge Highway Segment', 'Garage Lot Name', 'Ferry Direction', 'Ferry Terminal Name', 'Latitude', 'Longitude', 'Location']
agencies = {}
complaints = {}
descriptions =  {}
boroughs = {}
dates = {}
hours = {}
zipcodes = {}

tempDict = {}

with open('/Users/Jia/Documents/map_311/data_processed/nyc_all.csv', 'wb') as newcsvfile:
    spamwriter = csv.writer(newcsvfile)
    spamwriter.writerow(["agency","agencyDetail", "description", "date","weekday", "hour", "zipcode", "lat", "lng", "borough","tempMax", "tempMin"])

    with open('/Users/Jia/Documents/map_311/data_raw/nyc_311_Service_Requests_from_2010_to_Present.csv', 'rb') as csvfile:
        spamreader = csv.reader(csvfile)
        
        with open('/Users/Jia/Documents/map_311/data_raw/nyc_weather_371757.csv', 'rb') as csvfile2:
            temperatureFile = csv.reader(csvfile2)
            csvfile.seek(0)
            next(temperatureFile, None)
            
            for temperature in temperatureFile:
                tempDate = temperature[2]
                tempMax = round(float(temperature[12])*.1*9/5+32, 2)
                tempMin = round(float(temperature[13])*.1*9/5+32, 2)
                
                tempYear = tempDate[0:4]
                tempMonth = tempDate[4:6]
                tempDay = tempDate[6:8]
                
                tempNewDate = tempMonth+tempDay+tempYear
                
                tempDict[tempNewDate] = [tempMax, tempMin]
                
          #  print tempDict 
            csvfile.seek(10000000)
            next(spamreader, None)
            
            for row in spamreader:
                datearray = row[1].split(" ")
                date = datearray[0]
                month, day, year = (int(x) for x in date.split('/'))
                if int(year)!="":
                    ampm = datearray[2]
                    hour = int(datearray[1].split(":")[0])
        
                    if int(hour) == 12:
                        hour = int(hour)-12
                    if ampm == "PM":
                        hour = int(hour)+12
        

                    date = date.split('/')
                    date="".join(date)
                    weekday = datetime.date(year, month, day).weekday()
            
                    agency = row[3]
                    agencyDetail = row[4]
                    #if "School" in agency:
                    #    agency = "school"
        
                    complaint = row[5]
                    description = row[6]
                    description = description.strip(',')
                    id = row[0]
                   # created_at =row[1] 
                    zipcode = row[8][0:6]
                    lng = row[-2]
                    lat = row[-3]
                    borough = row[23]
                
                    if date in tempDict.keys():
                        temperatureMax = tempDict[date][0]
                        temperatureMin = tempDict[date][1]
                        if agency != "" and date !="" and zipcode !="" and lat !="" and lng!="" and borough!="" and  datearray[1] != "12:00:00" and  datearray[1] != "00:00:00":
                        #if agency != "" and date !="" and zipcode !="" and lat !="" and lng!="" and borough!="" and datearray[1] != "12:00:00" and  datearray[1] != "00:00:00":
                            #print [agency, description, date, weekday, hour, zipcode, lat, lng, borough, temperatureMax, temperatureMin]
                            spamwriter.writerow([agency,agencyDetail, description, date, weekday, hour, zipcode, lat, lng, borough, temperatureMax, temperatureMin])
               #print name,",",type,",",id,",",created_at,",",zipcode,",",lng,",",lat

    #print zipcodes
    #print agencies
    #print complaints
    #print boroughs
    #print descriptions
    #print dates
    #print hours
print hours