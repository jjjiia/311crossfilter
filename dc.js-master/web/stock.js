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
//var moveChart = dc.lineChart("#monthly-move-chart");
//var volumeChart = dc.barChart("#monthly-volume-chart");
//var yearlyBubbleChart = dc.bubbleChart("#yearly-bubble-chart");
//var rwChart = dc.geoChoroplethChart("#choropleth-map-chart");

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}


d3.csv("test_data.csv", function (data) {
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
		.ordinalColors(["#619633","#81DC3C","#B0DC92","#5E8D5D","#64DA78"])
        .dimension(borough)
        .group(boroughGroup)
        .label(function (d) {
            return toTitleCase(d.key);
        })
		.legend(dc.legend().x(40).y(0).gap(5));
    //#### Row Chart


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
        .height(200)
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
        .size(10) // (optional) max number of records to be shown, :default = 25
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
                return d.borough;
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

    /*
    //#### Geo Choropleth Chart
    //Create a choropleth chart and use the given css selector as anchor. You can also specify
    //an optional chart group for this chart to be scoped within. When a chart belongs
    //to a specific group then any interaction with such chart will only trigger redraw
    //on other charts within the same chart group.
    dc.geoChoroplethChart("#us-chart")
        .width(990) // (optional) define chart width, :default = 200
        .height(500) // (optional) define chart height, :default = 200
        .transitionDuration(1000) // (optional) define chart transition duration, :default = 1000
        .dimension(states) // set crossfilter dimension, dimension key should match the name retrieved in geo json layer
        .group(stateRaisedSum) // set crossfilter group
        // (optional) define color function or array for bubbles
        .colors(["#ccc", "#E2F2FF","#C4E4FF","#9ED2FF","#81C5FF","#6BBAFF","#51AEFF","#36A2FF","#1E96FF","#0089FF","#0061B5"])
        // (optional) define color domain to match your data domain if you want to bind data or color
        .colorDomain([-5, 200])
        // (optional) define color value accessor
        .colorAccessor(function(d, i){return d.value;})
        // Project the given geojson. You can call this function mutliple times with different geojson feed to generate
        // multiple layers of geo paths.
        //
        // * 1st param - geo json data
        // * 2nd param - name of the layer which will be used to generate css class
        // * 3rd param - (optional) a function used to generate key for geo path, it should match the dimension key
        // in order for the coloring to work properly
        .overlayGeoJson(statesJson.features, "state", function(d) {
            return d.properties.name;
        })
        // (optional) closure to generate title for path, :default = d.key + ": " + d.value
        .title(function(d) {
            return "State: " + d.key + "\nTotal Amount Raised: " + numberFormat(d.value ? d.value : 0) + "M";
        });

        //#### Bubble Overlay Chart
        // Create a overlay bubble chart and use the given css selector as anchor. You can also specify
        // an optional chart group for this chart to be scoped within. When a chart belongs
        // to a specific group then any interaction with such chart will only trigger redraw
        // on other charts within the same chart group.
        dc.bubbleOverlay("#bubble-overlay")
            // bubble overlay chart does not generate it's own svg element but rather resue an existing
            // svg to generate it's overlay layer
            .svg(d3.select("#bubble-overlay svg"))
            .width(990) // (optional) define chart width, :default = 200
            .height(500) // (optional) define chart height, :default = 200
            .transitionDuration(1000) // (optional) define chart transition duration, :default = 1000
            .dimension(states) // set crossfilter dimension, dimension key should match the name retrieved in geo json layer
            .group(stateRaisedSum) // set crossfilter group
            // closure used to retrieve x value from multi-value group
            .keyAccessor(function(p) {return p.value.absGain;})
            // closure used to retrieve y value from multi-value group
            .valueAccessor(function(p) {return p.value.percentageGain;})
            // (optional) define color function or array for bubbles
            .colors(["#ccc", "#E2F2FF","#C4E4FF","#9ED2FF","#81C5FF","#6BBAFF","#51AEFF","#36A2FF","#1E96FF","#0089FF","#0061B5"])
            // (optional) define color domain to match your data domain if you want to bind data or color
            .colorDomain([-5, 200])
            // (optional) define color value accessor
            .colorAccessor(function(d, i){return d.value;})
            // closure used to retrieve radius value from multi-value group
            .radiusValueAccessor(function(p) {return p.value.fluctuationPercentage;})
            // set radius scale
            .r(d3.scale.linear().domain([0, 3]))
            // (optional) whether chart should render labels, :default = true
            .renderLabel(true)
            // (optional) closure to generate label per bubble, :default = group.key
            .label(function(p) {return p.key.getFullYear();})
            // (optional) whether chart should render titles, :default = false
            .renderTitle(true)
            // (optional) closure to generate title per bubble, :default = d.key + ": " + d.value
            .title(function(d) {
                return "Title: " + d.key;
            })
            // add data point to it's layer dimension key that matches point name will be used to
            // generate bubble. multiple data points can be added to bubble overlay to generate
            // multiple bubbles
            .point("California", 100, 120)
            .point("Colorado", 300, 120)
            // (optional) setting debug flag to true will generate a transparent layer on top of
            // bubble overlay which can be used to obtain relative x,y coordinate for specific
            // data point, :default = false
            .debug(true);
    */

    //#### Rendering
    //simply call renderAll() to render all charts on the page
    dc.renderAll();
    /*
    // or you can render charts belong to a specific chart group
    dc.renderAll("group");
    // once rendered you can call redrawAll to update charts incrementally when data
    // change without re-rendering everything
    dc.redrawAll();
    // or you can choose to redraw only those charts associated with a specific chart group
    dc.redrawAll("group");
    */
});

//#### Version
//Determine the current version of dc with `dc.version`
d3.selectAll("#version").text(dc.version);
