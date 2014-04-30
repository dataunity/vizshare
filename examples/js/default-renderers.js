$(document).ready(function () {
    // Data definition settings
    var barSettings1 = [
        {
            "name": "default",
            "url": "data/data1.csv",
            "contentType": "text/csv",
            "fields": [
                {
                    "vizField": "xAxis",
                    "dataField": "Country"
                },
                {
                    "vizField": "yAxis",
                    "dataField": "Number"
                }
            ]
        }
    ];

    var barSettings2 = [
        {
            "name": "default",
            "url": "data/data2.csv",
            "contentType": "text/csv",
            "fields": [
                {
                    "vizField": "xAxis",
                    "dataField": "Region"
                },
                {
                    "vizField": "yAxis",
                    "dataField": "Count"
                }
            ]
        }
    ];

    var pieSettings = [
        {
            "name": "default",
            "url": "data/data2.csv",
            "contentType": "text/csv",
            "fields": [
                {
                    "vizField": "name",
                    "dataField": "Region"
                },
                {
                    "vizField": "value",
                    "dataField": "Count"
                }
            ]
        }
    ];

    // Button handlers
    $("#btnSettings1").click(function () {
        displayBarChart(barSettings1);
    });

    $("#btnSettings2").click(function () {
        displayBarChart(barSettings2);
    });

    function displayBarChart (settings) {
        // Draw the visualisation based on the settings
        vizshare.render({
            rendererName: "vizshare.barchart",
            selector: "#output",
            data: settings,
            vizOptions: {}
        });

        // Show the settings to the user
        var settingsStr = JSON.stringify(settings, null, 4);
        $("#settings").text(settingsStr);
    }

    function displayPieChart (settings) {
        // Draw the visualisation based on the settings
        vizshare.render({
            rendererName: "vizshare.piechart",
            selector: "#output-pie",
            data: settings,
            vizOptions: {}
        });

        // Show the settings to the user
        var settingsStr = JSON.stringify(settings, null, 4);
        $("#settings-pie").text(settingsStr);
    }

    function displaySmallPieChart (settings) {
        // Draw the visualisation based on the settings
        vizshare.render({
            rendererName: "vizshare.piechart",
            selector: "#output-pie-small",
            data: settings,
            vizOptions: {
                height: 200,
                width: 200
            }
        });
    }

    // Set initial views
    displayBarChart(barSettings1);
    displayPieChart(pieSettings);
    displaySmallPieChart(pieSettings);
});