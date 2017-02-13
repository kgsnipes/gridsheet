/* 
    Plugin : Gridsheet
    Author: Kaushik Ganguly
    description: trying to simulate spreadsheet functionality.
*/

;(function($, window, document, undefined) {
    /*defining all the constants require for gridsheet*/
    var CONSTANTS={
    'PIXEL_SUFFIX':'px',
    'EM_SUFFIX':'em',
    'PERCENTAGE_SUFFIX':'%',
    'ONEPX2EM':0.167,
    'CHROME_BROWSER':'Chrome',
    'SHEET_PREFIX':'Sheet ',
    'CELL_LABEL_SEPARATOR':'-',
    'COLUMN_NAME_CHARACTERS':'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z'.split(' ')
    };
    /* logging function providing a closure for wrapping console logging.
    this function will help us to toggle between the logging to the console based on 
    the DEV mode flag */
    function Logger(){
        /*defining DEV mode*/
        var DEV_MODE=true;
        var DEBUG_MODE=false;
        var infoLog=function(message)
        {
            if(DEV_MODE)
            {
                if(BrowserDetect.browser==CONSTANTS['CHROME_BROWSER'])
                {
                    console.log('%c[INFO]%c '+infoLog.caller.name+'() - '+message,'color:white;background-color:green;','color:black;background-color:white;');    
                }
                else
                {
                    console.log('[INFO] '+infoLog.caller.name+'() - '+message);        
                }
                
            }
            
        };
        var debugLog=function(message)
        {
            if(DEBUG_MODE && typeof debugLog.caller ==='function')
            {
                str=debugLog.caller.name+'() - '+message;
                str=str+' Arguments : [';
                $.each(debugLog.caller.arguments,function(index){
                    str=str+JSON.stringify(debugLog.caller.arguments[index])+' , ';
                })
                str=str+']';
                
                if(BrowserDetect.browser==CONSTANTS['CHROME_BROWSER'])
                {
                    str='%c[DEBUG]%c '+str;
                    console.log(str,'color:white;background-color:blue;','color:black;background-color:white;');
                }
                else
                {
                    console.log(str);
                }    
            }
        };
        var errorLog=function(message)
        {
            
            if(BrowserDetect.browser==CONSTANTS['CHROME_BROWSER'])
            {
                console.log('%c[ERROR]%c '+message,'color:white;background-color:red;','color:black;background-color:white;');    
            }
            else
            {
                console.log('[ERROR] '+message);        
            }
                
            
        };
        return {info:infoLog,debug:debugLog,error:errorLog};   
    };
    /*logging object*/
    var LOG=new Logger();
    
    /*adding browser detection capability in the plugin*/
    var BrowserDetect = {
        init: function () {
            this.browser = this.searchString(this.dataBrowser) || "Other";
            this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "Unknown";
        },
        searchString: function (data) {
            for (var i = 0; i < data.length; i++) {
                var dataString = data[i].string;
                this.versionSearchString = data[i].subString;

                if (dataString.indexOf(data[i].subString) !== -1) {
                    return data[i].identity;
                }
            }
        },
        searchVersion: function (dataString) {
            var index = dataString.indexOf(this.versionSearchString);
            if (index === -1) {
                return;
            }

            var rv = dataString.indexOf("rv:");
            if (this.versionSearchString === "Trident" && rv !== -1) {
                return parseFloat(dataString.substring(rv + 3));
            } else {
                return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
            }
        },

        dataBrowser: [
            {string: navigator.userAgent, subString: "Edge", identity: "MS Edge"},
            {string: navigator.userAgent, subString: "MSIE", identity: "Explorer"},
            {string: navigator.userAgent, subString: "Trident", identity: "Explorer"},
            {string: navigator.userAgent, subString: "Firefox", identity: "Firefox"},
            {string: navigator.userAgent, subString: "Opera", identity: "Opera"},  
            {string: navigator.userAgent, subString: "OPR", identity: "Opera"},  

            {string: navigator.userAgent, subString: "Chrome", identity: "Chrome"}, 
            {string: navigator.userAgent, subString: "Safari", identity: "Safari"}       
        ]
    };
    function Document()
    {
        var name=null;
        var sheets=null;
    }
    /*definition of a sheet*/
    function Sheet()
    {
        var name=null;
        var sheetData=null;
    }
    /*definition of a SheetCell*/
    function SheetCell()
    {
        var data=null;
        var label=null;/*this would be <ColumnName>-<RowNumber>*/
        var rowNumber=null;
        var columnName=null;

    };
    
   
    
    /*defining the plugin name*/
    var pluginName = 'gridsheet';
    /*creating a plugin*/
    function Plugin(element, options) {
        this.element = element;
        this._name = pluginName;
        this._defaults = $.fn.gridsheet.defaults;
        /*overriding options with default options defined*/
        this.options = $.extend({}, this._defaults, options);
        try{
            this.init();
        }
        catch(exception)
        {
            LOG.error(JSON.stringify(exception));
        }
        
    }
    /*adding functionality to the Plugin function created above*/
    $.extend(Plugin.prototype, {

        // Initialization logic
        init: function() {
             LOG.debug('Entering init() ');
            /*initiating browser detection*/
             BrowserDetect.init();
             /*init Document Data*/
             this.initDocumentData();
            /*this build the dom object and caches this in the jquery object*/
            this.buildCache();
            /*this starts to build up the UI*/
            this.buildUI();
            /*for binding events for the dom elements*/
            this.bindEvents();
            /*call the onComplete function after loading the plugin*/
            this.finishLoadingPlugin();

            
        },
        
        buildUI:function(){
           LOG.debug('Entering buildUI() ');
            /*creating the loader*/
            this.initLoader();
            /*loading the loading indicator*/
            this.loading();
            /*calculating the measurements required for buildiing the dom*/
            this.getInitialMeasurementsForUI();
            /*setting the dimensions for the container*/
            this.setDimensionsForContainer();
            
            /*creating the table*/
            this.assembleSheetUI();
            /*hiding the loader*/
            this.loaded();
           
        },
        initDocumentData:function()
        {
            LOG.debug('Entering initDocumentData() ');
            /*creating the document object*/
            this.document=new Document();
            /*initializing the sheets */
            this.document.sheets=new Array(this.options.sheets);
            for(i=0;i<this.options.sheets;i++)
            {
                /*creating the sheet and populating empty data in the sheets*/
                this.document.sheets[i]=new Sheet();
                this.document.sheets[i].name=CONSTANTS['SHEET_PREFIX']+(i+1);
                this.createSheetData(this.document.sheets[i],this.options.rows,this.options.columns);
            }  
        },
        createSheetData:function(sheet,rows,columns)
        {
            LOG.debug('Entering createSheetData() ');
            /*creating the sheet data as a 2D array*/
            sheet.sheetData=new Array(rows);
            for(i=0;i<sheet.sheetData.length;i++)
            {
                sheet.sheetData[i]=new Array(columns);
            }
            /*creating empty data in the cells.*/
            this.feedEmptyDataIntoNewCellsForSheet(sheet.sheetData);
            return sheet.sheetData;
        },
        feedEmptyDataIntoNewCellsForSheet:function(sheetData)
        {
            LOG.debug('Entering feedEmptyDataIntoNewCellsForSheet() ');
            /*iterating through the 2D Array and assigning the sheet cell object in the sheet data 2D array*/
            for(i=0;i<sheetData.length;i++)
            {
                for(j=0;j<sheetData[i].length;j++)
                {
                    sheetData[i][j]=new SheetCell();
                    this.createSheetCellWithData(sheetData[i][j],i,j,'');
                }
            }
            return sheetData;
        },
        createSheetCellWithData:function(cell,row,column,data)
        {
            LOG.debug('Entering createSheetCellEmptyData() ');
            /*creating and defining the sheet cell object with null data*/
            cell.data=data;
            cell.rowNumber=row;
            cell.columnName=getColumnNameForColumnNumber(column);
            cell.lable=cell.columnName+CONSTANTS['CELL_LABEL_SEPARATOR']+cell.rowNumber;
            return cell;
        },
        getColumnNameForColumnNumber:function(columnNumber)
        {
            LOG.debug('Entering getColumnNameForColumnNumber() ');
            /*need to revisit this logic as this needs to be optimized*/
            if(columnNumber<=25)
            {
                return CONSTANTS['COLUMN_NAME_CHARACTERS'][columnNumber];
            }
            else
            {
               var columnName='';
                i=columnNumber;
                j=0;
                while(i>25)
                {
                  j=i%26;
                  i=parseInt(i/26);
                  if(i<=26)
                  {
                    columnName=columnName+CONSTANTS['COLUMN_NAME_CHARACTERS'][i-1];
                  }      
                  else
                  {
                    columnName=columnName+this.getColumnNameForColumnNumber(i);
                  }
                    
                }
              if(j>=0){
               columnName=columnName+CONSTANTS['COLUMN_NAME_CHARACTERS'][j]; 
              }
              
               return columnName;
            }
        },
        getColumnNumberForColumnName:function(columnName)
        {
            var number=0;
            if(columnName.length>=1)
            {
              
              multiplier=1;
                    for(i=columnName.length-1;i>=0;i--,multiplier+=26)
                    {
                        index=CONSTANTS['COLUMN_NAME_CHARACTERS'].findIndex(function(element){return                              columnName.charAt(i)==element;});
                      console.log(index);
                        if(index!=-1)
                        {
                            number+=(((index+1)*multiplier)-1);
                        }
                    }     
            }
            return number;
        },
        assembleSheetUI:function()
        {
            LOG.debug('Entering assembleSheetUI() ');

            this.addColumns(this.options.columns);
        },
        addColumns:function(columnCount)
        {
           
        },
        setDimensionsForContainer:function () {
            LOG.debug('Entering setDimensionsForContainer() ');
            /*setting the dimension for the container after calculation*/
          this.$element.width(this.options._width);
          this.$element.height(this.options._height);  
        },
        getInitialMeasurementsForUI:function(){
            LOG.debug('Entering getInitialMeasurementsForUI() ');
            LOG.info('In function getInitialMeasurementsForUI()');
            LOG.info('width for the plugin : '+this.options.width);
            LOG.info('height for the plugin : '+this.options.height);
            
            /*fetching the  height and width dimension from the options and parsing
              them to float values.*/
            this.options._width=this.getMeasurementValue(this.options.width);
            this.options._height=this.getMeasurementValue(this.options.height);
            /*fetching the document width and height from the browser*/
            this.options._documentWidth=$(document).width();
            this.options._documentHeight=$(document).height();
            /*if the dimension is percentage or em based in the config then convert then to 
               pixel values as pixel values will be the based for all the calculations in this plugin*/
               /*first calculation for the width*/
            if(this.isPercentageValue(this.options.width))
            {
                this.options._width=this.getFloatValue((this.options._documentWidth/this.options._width)*100);
            }
            else if(this.isEmValue(this.options.width))
            {
                this.options._width=this.getFloatValue(this.options._width/CONSTANTS['ONEPX2EM']);
            }
            /*now calculation for the height*/
            if(this.isPercentageValue(this.options.height))
            {
               this.options._height=this.getFloatValue((this.options._documentHeight/this.options._height)*100);
            }
            else if(this.isEmValue(this.options.height))
            {
                 this.options._height=this.getFloatValue(this.options._height/CONSTANTS['ONEPX2EM']);
            }
            /*logging the calculated height and width calculation for the gridsheet container*/
            LOG.info('calculated height in pixels : '+this.options._height);
            LOG.info('calculated width in pixels : '+this.options._width);

            
            LOG.info('the column width is calculated at :'+this.options._columnWidth);
            LOG.info('the row height is calculated at : '+this.options._rowHeight);
            LOG.info('done with getInitialMeasurementsForUI');
        },
        /*converts a number corrected to 2 decimal places*/
        getFloatValue:function(value)
        {
            LOG.debug('Entering getFloatValue() ');
            return parseFloat(value).toFixed(2);
        },
        /*this function takes in the string and based on measurement units in the parameter gets the float
        value for the argument passed which is corrected to 2 decimal places*/
        getMeasurementValue:function(value)
        {
            LOG.debug('Entering getMeasurementValue() ');
            if(this.isPixelValue(value))
            {
               return parseFloat($.trim(value.substring(0,value.indexOf(CONSTANTS['PIXEL_SUFFIX'])))).toFixed(2);
            }
            else if(this.isEmValue(value))
            {
                return parseFloat($.trim(value.substring(0,value.indexOf(CONSTANTS['EM_SUFFIX'])))).toFixed(2);
            }
            else if(this.isPercentageValue(value))
            {
                return parseFloat($.trim(value.substring(0,value.indexOf(CONSTANTS['PERCENTAGE_SUFFIX'])))).toFixed(2);
            }
        },
        /*indicates if the value provided is a percentage value*/
        isPercentageValue:function(value)
        {
            LOG.debug('Entering isPercentageValue() ');
            return typeof(value) ===  'string' && value.indexOf(CONSTANTS['PERCENTAGE_SUFFIX'])>=0
        },
        /*indicates if the given value is a pixel value*/
        isPixelValue:function(value)
        {
            LOG.debug('Entering isPixelValue() ');
            return typeof(value) ===  'string' && value.indexOf(CONSTANTS['PIXEL_SUFFIX'])>=0
        },
        /*indicates if the given value is an em value*/
        isEmValue:function(value)
        {
            LOG.debug('Entering isEmValue() ');
            return typeof(value) ===  'string' && value.indexOf(CONSTANTS['EM_SUFFIX'])>=0
        },
        /*creating the loader dom*/
        initLoader:function()
        {
            LOG.debug('Entering initLoader() ');
            div=document.createElement('div');
            this.$loaderDiv=$(div);
            $(div).text('Loading');
            $(div).addClass('gridsheet_loader');
            this.$element.append(this.$loaderDiv);
            this.$loaderDiv.hide();
        },
        /*this show the loader on the browser*/
        loading:function()
        {
             LOG.debug('Entering loading() ');
            this.$loaderDiv.fadeIn();
            
        },
        /*this hides the loading indicator*/
        loaded:function()
        {
             LOG.debug('Entering loaded() ');
             this.$loaderDiv.fadeOut(500);
        },
        /*Remove plugin instance completely*/
        destroy: function() {
             LOG.debug('Entering destroy() ');
            this.unbindEvents();
            this.$element.removeData();
        },
        /*Cache DOM nodes for performance*/
        buildCache: function() {
             LOG.debug('Entering buildCache() ');
            this.$element = $(this.element);
            
        },
        /* Bind events that trigger methods*/
        bindEvents: function() {
            LOG.debug('Entering bindEvents() ');
            var plugin = this;

            plugin.$element.on('click' + '.' + plugin._name, function() {
                LOG.info('clicked the component');
               /* plugin.someOtherFunction.call(plugin);*/
            });
        },
        /*Unbind events that trigger methods*/
        unbindEvents: function() {
             LOG.debug('Entering unbindEvents() ');
            this.$element.off('.' + this._name);
        },
        /*this is a callback function the fires after the plugin is fully loaded*/
        finishLoadingPlugin: function() {
            LOG.debug('Entering finishLoadingPlugin() ');
            // Cache onComplete option
            var onComplete = this.options.onComplete;

            if (typeof onComplete === 'function') {
                onComplete.call(this.element);
            }
        }

    });
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
        width: '100%',
        height: '100%',
        columns:100,
        rows:500,
        _columnWidth:100,
        _rowHeight:30,
        _currentColumnCount:-1,
        _currentRowCount:-1,
        _currentColumnLabel:null,
        _currentSheetCount:-1,
        sheets:3,
        onComplete: null
    };

})(jQuery, window, document); 