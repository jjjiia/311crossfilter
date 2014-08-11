//# dc.js Getting Started and How-To Guide
'use strict';

//charts - divs

//var gainOrLossChart = dc.pieChart("#gain-loss-chart");
//var fluctuationChart = dc.barChart("#fluctuation-chart");
var boroughChart = dc.pieChart("#borough-chart");
var dayOfWeekChart = dc.rowChart("#day-of-week-chart");
var agencyChart = dc.rowChart("#agency-chart");
var hourChart = dc.barChart("#hour-chart");
var tempChart = dc.rowChart("#temperature-chart")
var nycMap = dc.geoChoroplethChart("#nyc-chart");
//var moveChart = dc.lineChart("#monthly-move-chart");
//var volumeChart = dc.barChart("#monthly-volume-chart");
//var yearlyBubbleChart = dc.bubbleChart("#yearly-bubble-chart");
//var rwChart = dc.geoChoroplethChart("#choropleth-map-chart");

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
queue()
.defer(d3.csv, "nyc_2013.csv")
.defer(d3.json, "nyc-zip-codes.geojson")
.await(ready);

function ready(error, data, geodata){
	//format dates
    var dateFormat = d3.time.format("%m%d%Y");
    var numberFormat = d3.format(".2f");
	
	//prepars date and month
    data.forEach(function (d) {
        d.dd = dateFormat.parse(d.date);
        d.month = d3.time.month(d.dd); // pre-calculate month for better performance
    });

    //### Create Crossfilter Dimensions and Groups
    //See the [crossfilter API](https://github.com/square/crossfilter/wiki/API-Reference) for reference.
    var ndx = crossfilter(data);
    var all = ndx.groupAll();

    // dimension by month
    var monthDimension = ndx.dimension(function (d) {
        return d.month;
    });
  
    var dateDimension = ndx.dimension(function (d) {
        return d.dd;
    });

	var temp = ndx.dimension(function(d){
		return d.tempMax
	})
	var tempGroup = temp.group();
    // create categorical dimension
    var agency = ndx.dimension(function (d) {
        return d.agency;
    });
    var agencyGroup = agency.group();

    var complaint = ndx.dimension(function (d) {
        return d.description;
    });
    var complaintGroup = complaint.group();
  
  
    var hour = ndx.dimension(function (d) {
        return d.hour;
    });
    var hourGroup = hour.group();
  
  
    var borough = ndx.dimension(function (d) {
        return d.borough;
    });
    var boroughGroup = borough.group();


    // counts per weekday
    var dayOfWeek = ndx.dimension(function (d) {
        var day = d.dd.getDay();
        var name=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
        return day+"."+name[day];
    });
    var dayOfWeekGroup = dayOfWeek.group();


    boroughChart.width(250)
        .height(250)
        .radius(120)
		.ordinalColors(["#619633","#81DC3C","#B0DC92","#5E8D5D","#64DA78",])
		.minAngleForLabel([.2])
        .dimension(borough)
		.ordering(function(d){ return d.value})
        .group(boroughGroup)
        .label(function (d) {
			//return toTitleCase(d.key) + ' ' + Math.round((d.endAngle - d.startAngle) / Math.PI * 50) + '%';
            return toTitleCase(d.key);
        })
		//.legend(dc.legend().x(40).y(0).gap(5));

    dayOfWeekChart.width(200)
        .height(200)
        .margins({top: 20, left: 10, right: 10, bottom: 20})
        .group(dayOfWeekGroup)
        .dimension(dayOfWeek)
        // assign colors to each value in the x scale domain
        .ordinalColors(['#aaa'])
        .label(function (d) {
            return d.key.split(".")[1];
        })
        // title sets the row text
        .title(function (d) {
            return d.value;
        })
        .elasticX(true)
        .xAxis().ticks(4);
		
    tempChart.width(200)
        .height(1200)
        .margins({top: 20, left: 10, right: 10, bottom: 20})
        .group(tempGroup)
        .dimension(temp)
		.ordering(function(d){ return -d.key})
        .ordinalColors(['#aaa'])
        .label(function (d) {
            return d.key;
        })
        .title(function (d) {
            return d.value;
        })
        .elasticX(true)
        .xAxis().ticks(4);
		
	agencyChart.width(500)
        .height(400)
        .margins({top: 20, left: 10, right: 10, bottom: 20})
        .group(agencyGroup)
        .dimension(agency)
		.ordering(function(d){ return -d.value })
        .ordinalColors(["#ccc"])
        .label(function (d) {
            return d.key+": "+ d.value + " incidents";
        })
        // title sets the row text
        .title(function (d) {
            return d.value;
        })
        .elasticX(true)
        .xAxis().ticks(4);
		
	hourChart.width(500)
	        .height(200)
	        .margins({top: 0, right: 50, bottom: 20, left: 40})
	        .ordinalColors(["#ccc"])
	        .dimension(hour)
	        .group(hourGroup)
	        .centerBar(true)
	        .gap(1)
	        .x(d3.scale.linear().domain([1,24]))
			
			
    dc.dataCount(".dc-data-count")
        .dimension(ndx)
        .group(all)
        // (optional) html, for setting different html for some records and all records.
        // .html replaces everything in the anchor with the html given using the following function.
        // %filter-count and %total-count are replaced with the values obtained.
        .html({
            some:"<strong>%filter-count</strong> selected out of <strong>%total-count</strong> records | <a href='javascript:dc.filterAll(); dc.renderAll();''>Reset All</a>",
            all:"All records selected. Please click on the graph to apply filters."
        });


		var projection = d3.geo.mercator()
						.center([-74.25,40.9])
						.translate([0, 0])
						.scale(55000);
    /*
    //#### Data Table
    // Create a data table widget and use the given css selector as anchor. You can also specify
    // an optional chart group for this chart to be scoped within. When a chart belongs
    // to a specific group then any interaction with such chart will only trigger redraw
    // on other charts within the same chart group.
    <!-- anchor div for data table -->
    <div id="data-table">
        <!-- create a custom header -->
        <div class="header">
            <span>Date</span>
            <span>Open</span>
            <span>Close</span>
            <span>Change</span>
            <span>Volume</span>
        </div>
        <!-- data rows will filled in here -->
    </div>
    */
    dc.dataTable(".dc-data-table")
        .dimension(dateDimension)
        // data table does not use crossfilter group but rather a closure
        // as a grouping function
        .group(function (d) {
            var format = d3.format("02d");
            return d.dd.getFullYear() + "/" + format((d.dd.getMonth() + 1));
        })
        .size(250) // (optional) max number of records to be shown, :default = 25
        // dynamic columns creation using an array of closures
        .columns([
            function (d) {
                return d.date;
            },
            function (d) {
                return d.agency;
            },
            function (d) {
                return d.zipcode;
            },
            function (d) {
                return toTitleCase(d.borough);
            },
            function (d) {
                return d.description;
            }
        ])
        // (optional) sort using the given field, :default = function(d){return d;}
        .sortBy(function (d) {
            return d.dd;
        })
        // (optional) sort order, :default ascending
        .order(d3.ascending)
        // (optional) custom renderlet to post-process chart using D3
        .renderlet(function (table) {
            table.selectAll(".dc-table-group").classed("info", true);
        });


	//nycMap
	var zipcode = ndx.dimension(function(d){
		return d.zipcode
	})
	var zipcodeGroup = zipcode.group();
	
	var colorScale = d3.scale.linear().domain([0,10000]).range(["#eee", "#f00"])
	
    nycMap
		.projection(projection)
        .width(500) // (optional) define chart width, :default = 200
        .height(500) // (optional) define chart height, :default = 200
        .transitionDuration(1000) // (optional) define chart transition duration, :default = 1000
        .dimension(zipcode) // set crossfilter dimension, dimension key should match the name retrieved in geo json layer
        .group(zipcodeGroup) // set crossfilter group
        //.colors(function(d, i){return  colorScale(d.value);})
		.colors(colorbrewer.YlOrRd[9])
		.colorDomain([0, 1000])
		.overlayGeoJson(geodata.features, "zipcode", function(d) {
            return d.properties.postalCode;
        })
        .title(function(d) {
            return "State: " + d.key + "\nTotal Amount Raised: " + numberFormat(d.value ? d.value : 0) + "M";
        });
    dc.renderAll();

};

//#### Version
//Determine the current version of dc with `dc.version`
d3.selectAll("#version").text(dc.version);
