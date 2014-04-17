$(document).ready(function () {
    // Data definition settings
    var settings1 = [
        {
            "name": "dataset1",
            "url": "data/data1.csv",
            "contentType": "text/csv",
            "fields": [
                {
                    "vizField": "myXAxis",
                    "dataField": "Country"
                },
                {
                    "vizField": "myYAxis",
                    "dataField": "Number"
                }
            ]
        }
    ];

    var settings2 = [
        {
            "name": "dataset1",
            "url": "data/data2.csv",
            "contentType": "text/csv",
            "fields": [
                {
                    "vizField": "myXAxis",
                    "dataField": "Region"
                },
                {
                    "vizField": "myYAxis",
                    "dataField": "Count"
                }
            ]
        }
    ];

    // Define the rendering function
    var renderFuncBar = function (selector, dataHelper, vizSettings) {
            // References to look up in the data settings
        var dataSetRef = "dataset1",
            xAxisFieldRef = "myXAxis",
            yAxisFieldRef = "myYAxis",

            // Actual field names in the data
            dataset = dataHelper.getDataset(dataSetRef),
            fieldXAxis = dataset.getDataField(xAxisFieldRef),
            fieldYAxis = dataset.getDataField(yAxisFieldRef);

        // Create the visualisation based on actual data fields (i.e. the
        // values in fieldXAxis and fieldYAxis)
        var margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = 600 - margin.left - margin.right,
            height = 350 - margin.top - margin.bottom;

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(10);

        d3.select(selector + " svg").remove();

        var svg = d3.select(selector).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        d3.csv(dataset.url, type, function(error, data) {
          if (error) {
            throw error.statusText;
          }
          x.domain(data.map(function(d) { return d[fieldXAxis]; }));
          y.domain([0, d3.max(data, function(d) { return d[fieldYAxis]; })]);

          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text(fieldYAxis);

          svg.selectAll(".bar")
              .data(data)
            .enter().append("rect")
              .attr("class", "bar")
              .attr("x", function(d) { return x(d[fieldXAxis]); })
              .attr("width", x.rangeBand())
              .attr("y", function(d) { return y(d[fieldYAxis]); })
              .attr("height", function(d) { return height - y(d[fieldYAxis]); });
        });

        function type(d) {
          d[fieldYAxis] = +d[fieldYAxis];
          return d;
        }

    };
    // Register the render function
    var rendererOpts = {'renderFunc': renderFuncBar};
    vizshare.registerRenderer("myCompany.barchart", rendererOpts);

    // Button handlers
    $("#btnSettings1").click(function () {
        displayBarChart(settings1);
    });

    $("#btnSettings2").click(function () {
        displayBarChart(settings2);
    });

    function displayBarChart (settings) {
        // Draw the visualisation based on the settings
        var renderOpts = {
            rendererName: "myCompany.barchart",
            selector: "#output",
            data: settings,
            vizOptions: {}
        };
        vizshare.render(renderOpts);

        // Show the settings to the user
        var settingsStr = JSON.stringify(settings, null, 4);
        $("#settings").text(settingsStr);
    }

    // Render default
    displayBarChart(settings1);
});