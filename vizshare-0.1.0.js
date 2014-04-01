var vizshare = vizshare || {};

vizshare = (function () {
    var rendererLookup = {},

    // Private methods
        render = function (vizType, selector, dataSettings, vizSettings) {
            var renderOpt = null,
                renderFunc = null,
                dataHelper = new vizshare.dataHelper(dataSettings);
            
            if (!rendererLookup.hasOwnProperty(vizType)) {
                throw "No renderer has been registered with the name '" + vizType + "'";
            }
            if (typeof dataSettings === 'undefined') {
                throw "No data settings were supplied when getting renderer."
            }
            
            renderOpt = rendererLookup[vizType];
            renderFunc = renderOpt.renderFunc;
            if (typeof renderFunc !== 'function') {
                throw "The renderer with the name '" + vizType + "' is not a function.";
            }
            renderFunc(selector, dataHelper, vizSettings);
        },

        registerRenderer = function (vizType, renderer) {
            rendererLookup[vizType] = renderer;
        },

        createDataHelper = function (dataSettings) {
            var dataHelper = {};
            dataHelper.dataSettings = dataSettings;

        };

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