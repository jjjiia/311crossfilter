//# dc.js Getting Started and How-To Guide
'use strict';

//charts - divs

//var gainOrLossChart = dc.pieChart("#gain-loss-chart");
//var fluctuationChart = dc.barChart("#fluctuation-chart");
var complaintChart = dc.rowChart("#complaint-chart");

var boroughChart = dc.pieChart("#borough-chart");
var dayOfWeekChart = dc.rowChart("#day-of-week-chart");
var agencyChart = dc.rowChart("#agency-chart");
var hourChart = dc.barChart("#hour-chart");
var tempChart = dc.barChart("#temperature-chart")
var nycMap = dc.geoChoroplethChart("#nyc-chart");
var zipcodeChart = dc.rowChart("#zipcode-chart");
//var moveChart = dc.lineChart("#monthly-move-chart");
//var volumeChart = dc.barChart("#monthly-volume-chart");
//var yearlyBubbleChart = dc.bubbleChart("#yearly-bubble-chart");
//var rwChart = dc.geoChoroplethChart("#choropleth-map-chart");

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}


queue()
.defer(d3.csv, "nyc_2013_ALL.csv")
//.defer(d3.csv, "nyc_smallSample.csv")
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


	var zipcode = ndx.dimension(function(d){
		return d.zipcode
	})
	var zipcodeGroup = zipcode.group();

	var topRowHeight = 120;
	var topRowColor = "#EDA929"
    dayOfWeekChart.width(180)
        .height(topRowHeight)
        .margins({top: 0, left: 30, right: 10, bottom: 20})
        .group(dayOfWeekGroup)
        .dimension(dayOfWeek)
        // assign colors to each value in the x scale domain
        .ordinalColors([topRowColor])
        .label(function (d) {
            return d.key.split(".")[1];
        })
		.labelOffsetX(-30)
		//.labelOffsetY(0)
		
        // title sets the row text
        .title(function (d) {
            return d.value;
        })
        .elasticX(true)
        .gap(2)
        .xAxis().ticks(4);
		
	hourChart.width(300)
	        .height(topRowHeight)
	        .margins({top: 0, right: 50, bottom: 20, left: 50})
	        .ordinalColors([topRowColor])
	        .dimension(hour)
	        .group(hourGroup)
	        .centerBar(true)
	        .gap(1)
	        .x(d3.scale.linear().domain([1,24]))
	        .yAxis().ticks(4);
			
    tempChart.width(300)
        .height(topRowHeight)
        .margins({top: 20, left: 50, right: 10, bottom: 20})
        .group(tempGroup)
        .dimension(temp)
        .ordinalColors([topRowColor])
        .centerBar(true)
        .gap(1)
        .x(d3.scale.linear().domain([1,124]))
        .yAxis().ticks(4)
	
		var boroughScale = d3.scale.linear().domain([0,7]).range(["#ffffff", "#dc3a23"])
		var boroughChartColors = []
		for(var i =2; i < 7; i ++){
			boroughChartColors.push(boroughScale(i))
		}
		
    boroughChart.width(300)
        .height(160)
        .radius(70)
		//.filter("BROOKLYN")
		//.ordinalColors(["#E69326","#EBB743","#E4782E","#E39E58","#B78433"])
		.ordinalColors(boroughChartColors)
		.minAngleForLabel([.2])
        .dimension(borough)
		.ordering(function(d){ return d.value})
        .group(boroughGroup)
        .label(function (d) {
			//return toTitleCase(d.key) + ' ' + Math.round((d.endAngle - d.startAngle) / Math.PI * 50) + '%';
            return toTitleCase(d.key);
        })
		
	zipcodeChart.width(200)
	    .height(200)
	    .margins({top: 20, left: 50, right: 10, bottom: 20})
	    .group(zipcodeGroup)
	    .dimension(zipcode)
		.gap(1)
		.data(function(zipcodeGroup){return zipcodeGroup.top(10)})
		.ordering(function(d){ return -d.value })
	    .ordinalColors(["#dc3a23"])
	    .label(function (d) {
	        return d.key;
	    })
		.labelOffsetX(-40)
	    // title sets the row text
	    .title(function (d) {
	        return d.value;
	    })
	    .elasticX(true)
	    .xAxis().ticks(4);
			
			
		var bottomRowHeight = 200
	agencyChart.width(300)
        .height(bottomRowHeight)
        .margins({top: 0, left: 5, right: 10, bottom: 0})
        .group(agencyGroup)
        .dimension(agency)
		.data(function(agencyGroup){return agencyGroup.top(10)})
		.ordering(function(d){ return -d.value })
        .ordinalColors(["#55649B"])
        .label(function (d) {
            return d.key+": "+ d.value + " incidents";
        })
        // title sets the row text
        .title(function (d) {
            return d.value;
        })
        .elasticX(true)
        .xAxis().ticks(4);
		
	complaintChart.width(300)
        .height(bottomRowHeight)
        .margins({top: 0, left: 5, right: 10, bottom: 0})
        .group(complaintGroup)
        .dimension(complaint)
		.data(function(complaintGroup){return complaintGroup.top(10)})
		.ordering(function(d){ return -d.value })
        .ordinalColors(["#55649B"])
        .label(function (d){
            return d.key+": "+ d.value + " incidents";
        })
        .elasticX(true)
        .xAxis().ticks(4);
		
	
			
    dc.dataCount(".dc-data-count")
        .dimension(ndx)
        .group(all)
        // (optional) html, for setting different html for some records and all records.
        // .html replaces everything in the anchor with the html given using the following function.
        // %filter-count and %total-count are replaced with the values obtained.
        .html({
            some:"<strong>%filter-count</strong> selected out of <strong>%total-count</strong> records | <a href='javascript:dc.filterAll(); dc.renderAll();''>Reset All</a>",
            all:"All  <strong>%total-count</strong> records selected. Please click on the graph to apply filters."
        })
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
 
 /*   dc.dataTable(".dc-data-table")
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

*/
	//nycMap
	//var colorScale = d3.scale.linear().domain([0,10000]).range(["#eee", "#dc3a23"])

	var projection = d3.geo.mercator()
					.center([-74.25,40.915])
					.translate([0, 0])
					.scale(45000);
    nycMap
		.projection(projection)
        .width(480) // (optional) define chart width, :default = 200
        .height(430) // (optional) define chart height, :default = 200
        .transitionDuration(1000) // (optional) define chart transition duration, :default = 1000
        .dimension(zipcode) // set crossfilter dimension, dimension key should match the name retrieved in geo json layer
        .group(zipcodeGroup) // set crossfilter group
        //.colors(function(d, i){return  colorScale(d.value);})
		.colors(d3.scale.linear().domain([0,11000]).range(["#ffffff", "#dc3a23"]))
		//.colors(d3.scale.linear().domain([0,100]).range(["#fff", "#dc3a23"]))
		.overlayGeoJson(geodata.features, "zipcode", function(d) {
            return d.properties.postalCode;
        })
		.legend(dc.legend().x(170).y(0).gap(5));

    dc.renderAll();

};

//#### Version
//Determine the current version of dc with `dc.version`
d3.selectAll("#version").text(dc.version);
