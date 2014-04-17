var vizshare = vizshare || {};

vizshare = (function () {
    var rendererLookup = {},

    // Private methods
        render = function (options) {
            var rendererName = null, 
                selector = null, 
                data = null, 
                vizOptions = {},
                renderOpt = null,
                renderFunc = null,
                dataHelper = null;

            // Check required properties have been supplied
            if (typeof options !== 'object') {
                throw "The render options must be supplied as an object.";
            }
            if (!options.hasOwnProperty("rendererName")) {
                throw "The rendererName must be supplied as part of the render options.";
            }
            if (!options.hasOwnProperty("selector")) {
                throw "The selector must be supplied as part of the render options.";
            }
            if (!options.hasOwnProperty("data")) {
                throw "The data settings must be supplied as part of the render options.";
            }

            // Get the render options
            rendererName = options["rendererName"];
            selector = options["selector"];
            data = options["data"];
            if (options.hasOwnProperty("vizOptions")) {
                vizOptions = options["vizOptions"]
            }

            // Setup the data helper
            if (typeof data === 'undefined') {
                throw "No data settings were supplied when getting renderer."
            }
            dataHelper = new vizshare.dataHelper(data);
            
            // Run renderer
            if (!rendererLookup.hasOwnProperty(rendererName)) {
                throw "No renderer has been registered with the name '" + rendererName + "'";
            }
            renderOpt = rendererLookup[rendererName];
            renderFunc = renderOpt.renderFunc;
            if (typeof renderFunc !== 'function') {
                throw "The renderer with the name '" + rendererName + "' is not a function.";
            }
            renderFunc(selector, dataHelper, vizOptions);
        },

        registerRenderer = function (rendererName, rendererOptions) {
            rendererLookup[rendererName] = rendererOptions;
        };

        //createDataHelper = function (dataSettings) {
        //    var dataHelper = {};
        //    dataHelper.dataSettings = dataSettings;
        //};

    // Public
    return {
        registerRenderer: registerRenderer,
        render: render
    };
} ());

vizshare.dataHelper = (function () {
    var Constr,
        dataSettings = {};
    // public API -- constructor
    Constr = function (dataSettings1) {
        var item = this;
        dataSettings = dataSettings1;
    };

    // public API -- prototype
    Constr.prototype = {
        constructor: vizshare.dataHelper,
        version: "0.1.0",
        dataSettings: dataSettings,
        getDataset: function (datasetName) {
            var datasets = dataSettings,
                len = datasets.length,
                i = 0,
                dataSetHelper = null,
                dataSetSettings = {};
            for (i = 0; i < len; i += 1) {
                if (datasets[i].name === datasetName) {
                    dataSetSettings = datasets[i];
                    dataSetHelper = new vizshare.dataSetHelper(dataSetSettings);
                    return dataSetHelper;
                }
            }
            return null;
        }
    };
    
    // return the constructor to be assigned to the new namespace
    return Constr;
} ());

vizshare.dataSetHelper = (function () {
    var Constr,
        dataSetSettings = {},
        url = null;
    // public API -- constructor
    Constr = function (dataSetSettings) {
        var item = this;
        item.dataSetSettings = dataSetSettings;

        // Copy the data settings onto the helper for easy access
        item.url = dataSetSettings.url;
    };

    // public API -- prototype
    Constr.prototype = {
        constructor: vizshare.dataSetHelper,
        version: "0.1.0",
        url: url,
        dataSetSettings: dataSetSettings,
        getDataField: function (vizFieldName) {
            var fields = this.dataSetSettings.fields,
                len = fields.length,
                i = 0,
                field = null;
            for (i = 0; i < len; i += 1) {
                if (fields[i].vizField === vizFieldName) {
                    field = fields[i];
                    if (typeof field === 'undefined') {
                        throw "Could not find field with viz name'" + vizFieldName + "'";
                    }
                    return field.dataField;
                }
            }
            return null;
        }
    };

    // return the constructor to be assigned to the new namespace
    return Constr;
} ());