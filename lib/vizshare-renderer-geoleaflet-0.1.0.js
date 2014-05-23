// Geo rendering using Leaflet
(function ($, d3, L) {
    var dataToGeoJSON = function (data, latField, longField, titleField) {
        // Converts csv to geo json
        var i = 0,
            row = null,
            lat = 0,
            long = 0,
            title = "",
            feature = {},
            features = [];

        $.each(data, function (index, row) {
            lat = row[latField];
            long = row[longField];
            feature = {
                "type" : "Feature",
                "geometry" : {
                    "type" : "Point",
                    "coordinates" : [long, lat]
                },
                "properties" : { 
                    "name" : "test", 
                    "circle": "true",
                    "radius": 150
                }
            };
            features.push(feature);
        });

        return features;
    },

        renderFuncGeoLeaflet = function (selector, dataHelper, vizSettings) {
            // References to look up in the data settings
            var dataSetRef = "default",
                latFieldRef = "lat",
                longFieldRef = "long",
                titleFieldRef = "title",

                // Actual field names in the data
                dataset = dataHelper.getDataset(dataSetRef),
                fieldLat = dataset.getDataField(latFieldRef),
                fieldLong = dataset.getDataField(longFieldRef),
                fieldTitle = dataset.getDataField(titleFieldRef),

                domElem = $(selector).get(0),
                map = L.map(domElem).setView([51.505, -0.09], 13);

            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            d3.csv("data/geo_data.csv", function(error, data) {
                var features = [];
                if (error) {
                    throw error;
                }

                features = dataToGeoJSON(data, fieldLat, fieldLong, fieldTitle);
                console.log(features);


                L.geoJson(features, {
                        pointToLayer: function (feature, latlng) {
                            if (typeof (feature.properties) != 'undefined' && 
                                typeof (feature.properties.circle) != 'undefined' && 
                                feature.properties.circle == 'true') {
                                return L.circle(latlng, feature.properties.radius);
                            }
                            return L.marker(latlng);
                        }
                    }).addTo(map);
            });
        };

    // Register the render function
    var renderOpts = {'renderFunc': renderFuncGeoLeaflet};
    vizshare.registerRenderer("vizshare.geoleaflet", renderOpts);
} (jQuery, d3, L));
