/*plugging this plugin to the jquery object*/
    $.fn.gridsheet = function(options) {
        this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
        return this;
    };
    /*defining the default options for gridsheet*/
    $.fn.gridsheet.defaults = {
        width: '80%',
        height: '80%',
        columns:12,
        rows:100,
        _columnWidth:100,
        _rowHeight:30,
        sheets:3,
        onComplete: null,
        documentName:'Untitled Document',
        document:null,
        onImportDone:function(documentObj){ LOG.info('Default on Import Done event');},
        onSave:function(documentObj){LOG.info('Default on save Event');}
    };