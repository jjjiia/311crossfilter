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
with open('/Users/Jia/Documents/map_311/data_processed/nyc_2013.csv', 'wb') as newcsvfile:
    spamwriter = csv.writer(newcsvfile)
    spamwriter.writerow(["agency", "description", "date","weekday", "hour", "zipcode", "lat", "lng", "borough"])

    with open('/Users/Jia/Documents/map_311/data_raw/nyc_311_Service_Requests_from_2010_to_Present.csv', 'rb') as csvfile:
        spamreader = csv.reader(csvfile)
        csvfile.seek(0)
        next(spamreader, None)   
        for row in spamreader:
            
            datearray = row[1].split(" ")
            ampm = datearray[2]
            hour = int(datearray[1].split(":")[0])
        
            if int(hour) == 12:
                hour = int(hour)-12
            if ampm == "PM":
                hour = int(hour)+12
        
            date = datearray[0]
            month, day, year = (int(x) for x in date.split('/'))
            date = date.split('/')
            date="".join(date)
            weekday = datetime.date(year, month, day).weekday()
            
            agency = row[3]
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
        
          #  zipcodes[zipcode] = zipcodes.get(zipcode,0)+1
          #  agencies[agency] = agencies.get(agency,0)+1
          #  descriptions[description] = descriptions.get(description,0)+1
          #  complaints[complaint] = complaints.get(complaint, 0)+1
          #
          # # if datearray[1] != "12:00:00":
          #  hours[hour] = hours.get(hour,0)+1
          #
          #  boroughs[borough] = boroughs.get(borough, 0)+1 
          #  dates[date] = dates.get(date, 0)+1
            if agency != "" and date !="" and zipcode !="" and lat !="" and lng!="" and borough!="" and int(year) == 2013 and  datearray[1] != "12:00:00" and  datearray[1] != "00:00:00":
               # print [agency, complaint, date, weekday, hour, zipcode, lat, lng, borough]
               # hours[hour] = hours.get(hour,0)+1
               # if int(hour) > 2 and int(hour) < 10:
               #     print hour
                spamwriter.writerow([agency, description, date, weekday, hour, zipcode, lat, lng, borough])
        
           #print name,",",type,",",id,",",created_at,",",zipcode,",",lng,",",lat

    #print zipcodes
    #print agencies
    #print complaints
    #print boroughs
    #print descriptions
    #print dates
    #print hours
print hours