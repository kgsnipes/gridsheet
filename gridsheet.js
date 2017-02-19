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
    'COLUMN_NAME_CHARACTERS':'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    'OPTIMAL_ROWS':100,
    'OPTIMAL_COLUMNS':10,
    'CELL_CSS_PREFIX':'cell',
    'DATATYPE_TEXT':'text',
    'DATATYPE_NUMBER':'number',
    'DATATYPE_DATE':'date'
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
            /*info should only be enabled on DEV mode at least for a JS */
            if(DEV_MODE)
            {
                /* if chrome browser is detected then add styling to the info logging statement*/
                if(BrowserDetect.browser==CONSTANTS['CHROME_BROWSER'] && console.info)
                {
                    console.info('%c[INFO]%c '+infoLog.caller.name+'() - '+message,'color:white;background-color:green;','color:black;background-color:white;');    
                }
                /* if it is not chrome browser then atleast look for info function and use it*/
                else if(BrowserDetect.browser!=CONSTANTS['CHROME_BROWSER'] && console.info)
                {
                    console.info('[INFO]'+infoLog.caller.name+'() - '+message);
                }
                /* if even info object is not available the just use console.log*/
                else if(!console.info && console.log)
                {
                    console.log('[INFO] '+infoLog.caller.name+'() - '+message);        
                }
                /* no action performed if even console.log is not available - very bad browser */
            }
            
        };
        var debugLog=function(message)
        {
            /*should be enabled only on debug mode as this might generate a awful lot of logs. also i have reserved it to be called only by a function*/
            if(DEBUG_MODE && typeof debugLog.caller ==='function')
            {
                str=debugLog.caller.name+'() - '+message;
                str=str+' Arguments : [';
                $.each(debugLog.caller.arguments,function(index){
                    str=str+JSON.stringify(debugLog.caller.arguments[index])+' , ';
                })
                str=str+']';
                /* styling the debug statement if this is a chrome browser*/
                if(BrowserDetect.browser==CONSTANTS['CHROME_BROWSER'] && console.debug)
                {
                    console.debug('%c[DEBUG]%c '+str,'color:white;background-color:blue;','color:black;background-color:white;');  
                }
                else if(BrowserDetect.browser!=CONSTANTS['CHROME_BROWSER'] && console.debug)
                {
                    console.debug('[DEBUG]'+str);
                }
                else if(!console.debug && console.log)
                {
                    console.log('[DEBUG]'+str);
                }    
                 /* no action performed if even console.log is not available - very bad browser */
            }
        };
        var errorLog=function(message)
        {
            /* as it is mandatory to log any errors we first need to know if the browser has support for atleast basic logging*/
            if(!console.log)
                return;
            /* styling the debug statement if this is a chrome browser*/
            if(BrowserDetect.browser==CONSTANTS['CHROME_BROWSER'] && console.error)
            {
                console.error('%c[ERROR]%c '+message,'color:white;background-color:red;','color:black;background-color:white;');     
            }
            else if(BrowserDetect.browser!=CONSTANTS['CHROME_BROWSER'] && console.error)
            {
                console.error('[ERROR]'+message);            
            }
            else if(!console.error && console.log)
            {
                 console.log('[ERROR]'+message); 
            }
             /* no action performed if even console.log is not available - very bad browser */
                
        };

         var warningLog=function(message)
        { 
            /* as it is mandatory to log any warning we first need to know if the browser has support for atleast basic logging*/
            if(!console.log)
                return;
            /* should not be available outside of dev mode*/
            if(!DEV_MODE)
                return;
            /* styling the warning statement if this is a chrome browser*/
            if(BrowserDetect.browser==CONSTANTS['CHROME_BROWSER'] && console.warn)
            {
                console.warn('%c[WARNING]%c '+message,'color:white;background-color:orange;','color:black;background-color:white;');     
            }
            else if(BrowserDetect.browser!=CONSTANTS['CHROME_BROWSER'] && console.warn)
            {
                console.warn('[WARNING] '+message);            
            }
            else if(!console.warn && console.log)
            {
                console.log('[WARNING] '+message); 
            }
             /* no action performed if even console.log is not available - very bad browser */
            
        };
        return {info:infoLog,debug:debugLog,error:errorLog,warn:warningLog};   
    };
    /*logging object*/
    var LOG=new Logger();
    
    /*adding browser detection capability in the plugin*/
    /*borrowed this from https://gist.github.com/iwanbk/5906833 */
    var BrowserDetect = {
        init: function() {
            this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
            this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version";
            this.OS = this.searchString(this.dataOS) || "an unknown OS";
        },
        searchString: function(data) {
            for (var i = 0; i < data.length; i++) {
                var dataString = data[i].string;
                var dataProp = data[i].prop;
                this.versionSearchString = data[i].versionSearch || data[i].identity;
                if (dataString) {
                    if (dataString.indexOf(data[i].subString) != -1) return data[i].identity;
                } else if (dataProp) return data[i].identity;
            }
        },
        searchVersion: function(dataString) {
            var index = dataString.indexOf(this.versionSearchString);
            if (index == -1) return;
            return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
        },
        dataBrowser: [{
            string: navigator.userAgent,
            subString: "Chrome",
            identity: "Chrome"
        }, {
            string: navigator.userAgent,
            subString: "OmniWeb",
            versionSearch: "OmniWeb/",
            identity: "OmniWeb"
        }, {
            string: navigator.vendor,
            subString: "Apple",
            identity: "Safari",
            versionSearch: "Version"
        }, {
            prop: window.opera,
            identity: "Opera",
            versionSearch: "Version"
        }, {
            string: navigator.vendor,
            subString: "iCab",
            identity: "iCab"
        }, {
            string: navigator.vendor,
            subString: "KDE",
            identity: "Konqueror"
        }, {
            string: navigator.userAgent,
            subString: "Firefox",
            identity: "Firefox"
        }, {
            string: navigator.vendor,
            subString: "Camino",
            identity: "Camino"
        }, { // for newer Netscapes (6+)
            string: navigator.userAgent,
            subString: "Netscape",
            identity: "Netscape"
        }, {
            string: navigator.userAgent,
            subString: "MSIE",
            identity: "Explorer",
            versionSearch: "MSIE"
        }, {
            string: navigator.userAgent,
            subString: "Gecko",
            identity: "Mozilla",
            versionSearch: "rv"
        }, { // for older Netscapes (4-)
            string: navigator.userAgent,
            subString: "Mozilla",
            identity: "Netscape",
            versionSearch: "Mozilla"
        }],
        dataOS: [{
            string: navigator.platform,
            subString: "Win",
            identity: "Windows"
        }, {
            string: navigator.platform,
            subString: "Mac",
            identity: "Mac"
        }, {
            string: navigator.userAgent,
            subString: "iPhone",
            identity: "iPhone/iPod"
        }, {
            string: navigator.platform,
            subString: "Linux",
            identity: "Linux"
        }]

    };
    function Document()
    {
        var name=null;
        var sheets=null;
    };
    /*definition of a sheet*/
    function Sheet()
    {
        var name=null;
        var sheetData=null;
    };
    function CellProperties()
    {
        var styleClasses=null;
        var formula=null;
        var columnWidth=null;
        var rowHeight=null;
    };
    /*definition of a SheetCell*/
    function SheetCell()
    {
        var data=null;
        var label=null;/*this would be <ColumnName>-<RowNumber>*/
        var rowNumber=null;
        var columnName=null;
        var dataLabel=null;
        var properties=null;
        var dataType=null;

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
            LOG.error(exception.name +" - "+exception.message+" - "+exception.stack);
        }
        
    };
    /*adding functionality to the Plugin function created above*/
    $.extend(Plugin.prototype, {

        // Initialization logic
        init: function() {
             LOG.debug('Entering init() ');
            /*initiating browser detection*/
             BrowserDetect.init();
             /*check for performance related risks */
              this.performanceCheckForOptions();
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

            this.options._currentColumnCount=this.options.columns;
            this.options._currentRowCount=this.options.rows;
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
        performanceCheckForOptions:function()
        {
              LOG.debug('Entering performanceCheckForOptions() ');
              /*assessing the risk on the performance in regards to the options provided for the plugin*/
              /*we should have optimal number of rows on the sheet - which should be between 100 and 200 on load*/
              if(this.options.rows>CONSTANTS['OPTIMAL_ROWS'])
              {
                LOG.warn('Please reduce the number of rows to '+CONSTANTS['OPTIMAL_ROWS']+' or less for reducing the risk on performance');
              }
              /*we should have the optimal number of columns on the sheet - which should be between 10-20 on load */
              if(this.options.columns>CONSTANTS['OPTIMAL_COLUMNS'])
              {
                LOG.warn('Please reduce the number of rows to '+CONSTANTS['OPTIMAL_COLUMNS']+' or less for reducing the risk on performance');
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
                    this.createSheetCellWithData(sheetData[i][j],i,j,'',CONSTANTS['DATATYPE_TEXT']);
                }
            }
            return sheetData;
        },
        createSheetCellWithData:function(cell,row,column,data,dataType)
        {
            LOG.debug('Entering createSheetCellEmptyData() ');
            /*creating and defining the sheet cell object with null data*/
            cell.data=data;
            cell.rowNumber=row;
            cell.columnName=this.getColumnNameForColumnNumber(column+1);
            cell.lable=cell.columnName+CONSTANTS['CELL_LABEL_SEPARATOR']+cell.rowNumber;
            cell.dataLabel=row+'-'+column;
            cell.dataType=dataType;
            this.addDefaultPropertiesForSheetCell(cell);
            return cell;
        },
        addDefaultPropertiesForSheetCell:function(cell)
        {
            props=new CellProperties();
            props.styleClasses=[];
            props.styleClasses.push('gridsheet_cell');
            props.columnWidth=this.options._columnWidth;
            props.rowHeight=this.options._rowHeight;
            props.formula=null;
            cell.properties=props;
            return props;
        },
        getColumnNameForColumnNumber:function(columnNumber)
        {
            LOG.debug('Entering getColumnNameForColumnNumber() ');
            /* deriving the column name from the cloumn number */
            /*
                Logic for understanding:
                - while the columnNumber is less than the number of column labels
                just keep dividing the columnNumber and append the character at the index(quotient-1) in the column labels list.
                Also keep storing the remainder(modulo value).

                - if the columnNumber is lesser than the number of column Labels then the logic breaks the loop.

                - if the remainder is greater than zero then append the character at the index(remainder-1) in the column labels list.
                - if the remainder is lesser or equal to zero then use the character at the index(quotient-1) in the column labels list.
            */
             columnName='';
             remainder=0;
             arrLength=CONSTANTS['COLUMN_NAME_CHARACTERS'].length;
                while(columnNumber>arrLength)
                {
                    remainder=columnNumber%arrLength;
                    columnNumber=columnNumber/arrLength;
                    columnName+=CONSTANTS['COLUMN_NAME_CHARACTERS'].charAt(columnNumber-1);
                }
                if(remainder>0)
                    columnName+=CONSTANTS['COLUMN_NAME_CHARACTERS'].charAt(remainder-1);
                else
                    columnName+=CONSTANTS['COLUMN_NAME_CHARACTERS'].charAt(columnNumber-1);
                    
            return columnName;        
        },
        getColumnNumberForColumnName:function(columnName)
        {
            LOG.debug('Entering getColumnNumberForColumnName() ');
            /* deriving the column number from column name*/
            /*
                Logic for understanding:
                - if the columnName is of single character in length then return index of the character in the columnLabel list.
                - else find the index of the character from the left side of the column name and determine the index of the column label and add one. now 
                multiply the this by length of the columnLabel list. and add it to the return value.
                - keep calling the same function onto itself till the columnName length is greater than or equal to one as you strip out characters from the left
                after the previous step. keep adding the result to the return value.
            */
            var ret=1;
            if(columnName.length==1)
            {
                ret=CONSTANTS['COLUMN_NAME_CHARACTERS'].indexOf(columnName.charAt(0));
            }
            else if(columnName.length>1)
            {
                ret+=(CONSTANTS['COLUMN_NAME_CHARACTERS'].length*(CONSTANTS['COLUMN_NAME_CHARACTERS'].indexOf(columnName.charAt(0))+1));
                if(columnName.substring(1).length>=1)
                    ret+=getColumnNumberForColumnName(columnName.substring(1));    
            }
            return ret;
            
        },
        assembleSheetUI:function()
        {
            LOG.debug('Entering assembleSheetUI() ');
            this.renderGutterColumn();
            //this.renderDataColumns();
        },
        renderGutterColumn:function(){
             LOG.debug('Entering renderGutterColumn() ');
            $ul=this.createGridSheetColumn();
            isFirstRow=true;
            styleClasses={'styleClasses':['gridsheet_cell','gridsheet_content_align_center']};
            for(i=0;i<(this.options._currentRowCount+1);i++)
            {                
                if(isFirstRow)
                {
                    isFirstRow=!isFirstRow;
                    this.appendGridSheetCellToColumn($ul,this.createSheetCellWithData(new SheetCell(),-i,-1,'',CONSTANTS['DATATYPE_TEXT']),styleClasses);
                }
                else
                {
                    this.appendGridSheetCellToColumn($ul,this.createSheetCellWithData(new SheetCell(),-i,-1,i,CONSTANTS['DATATYPE_TEXT']),styleClasses);
                }

            }            
            
        },
        createGridSheetColumn:function(columnNumber)
        {
            LOG.debug('Entering createGridSheetColumn() ');
            ul=document.createElement('ul');
            $ul=$(ul);
            $ul.addClass('gridsheet_column');
            $ul.width(this.options._columnWidth);
            $ul.height(this.options._currentRowCount*this.options._rowHeight);            
            $ul.data({'columnNumber':columnNumber});            
            this.$element.append($ul);
            return $ul;
        },
        appendGridSheetCellToColumn:function(list,sheetCell,props)
        {
            LOG.debug('Entering appendGridSheetCellToColumn() ');
            sheetCell.properties=$.extend({}, sheetCell.properties, props);
            li=document.createElement('li');
            $li=$(li);
            this.addPropertiesToGridSheetCellDOM($li,sheetCell);
            list.append($li);
        },
        addPropertiesToGridSheetCellDOM:function(cell,sheetCell)
        {
            LOG.debug('Entering addPropertiesToGridSheetCellDOM() ');
            $li.attr('class',sheetCell.properties.styleClasses.join(' '));
            $li.addClass(+sheetCell.dataLabel);
            $li.data({'data':sheetCell});
            $li.width(sheetCell.properties.columnWidth);
            $li.height(sheetCell.properties.rowHeight);
            this.fillDataForCellDOM(cell,sheetCell);
             
        },
        fillDataForCellDOM:function(cell,sheetCell)
        {
            LOG.debug('Entering fillDataForCellDOM() ');
            switch (sheetCell.dataType) {
              case CONSTANTS['DATATYPE_NUMBER']:
                //Statements executed when the result of expression matches value2
                break;
              case CONSTANTS['DATATYPE_TEXT']:
              default:
                 label=document.createElement('label');
                 $label=$(label);
                 $label.text(sheetCell.data);
                 cell.append($label);
                break;
            }
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
            /* reducing 10 percent from the document dimensions*/
            this.options._documentWidth=$(document).width()-($(document).width()*0.02);
            this.options._documentHeight=$(document).height()-($(document).height()*0.02);
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
        columns:10,
        rows:100,
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