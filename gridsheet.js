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
    'CSS_NAMING_SEPARATOR':'_',
    'SHEET_CSS_PREFIX':'sheet',
    'DATATYPE_TEXT':'text',
    'DATATYPE_NUMBER':'number',
    'DATATYPE_DATE':'date',
    'SHEET_BUTTON_WIDTH':100, /*100 pixels*/
    'SCROLL_TOP_OFFSET':0,
    'SCROLL_LEFT_OFFSET':-16,
    'DUMMY_TOP_BAR_Z_INDEX':100
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
        var _columnCount=0;
        var _rowCount=0;
        var domContainer=null;
        var sheetNumber=0;
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
            /* adding container for toolbar and document name*/
            this.addingToolBarAndDocumentContainer();
            /*creating the table*/
            this.generateDocumentUI();
            /*hiding the loader*/
            this.loaded();
           
        },
        addingToolBarAndDocumentContainer:function () {
            
             LOG.debug('Entering addingToolBarAndDocumentContainer() ');
             /* defining the document container with 80% height of the gridsheet plugin*/
            var $documentContainer=$(document.createElement('div'));
            $documentContainer.addClass('gridsheet_document_container').width(this.$element.width()).height(this.$element.height()*0.80);

            /* defining the toolbar for the gridsheet plugin with 20% of the height */
            var $toolBarDiv=$(document.createElement('div'));
            $toolBarDiv.addClass('gridsheet_toolbar').width(this.$element.width()-(this.$element.width()*0.01)).height(this.$element.height()*0.20);
            this.createToolBarUI($toolBarDiv);
            /* adding the toolbar to the gridsheet plugin dom*/
            this.$element.append($toolBarDiv);
            /* adding the documentContainer to the gridsheet plugin dom*/
            this.$element.append($documentContainer);
        },
        createToolBarUI:function (toolBarDiv) {

            $input=$(document.createElement('input'));
            $input.attr("type","text");
            $input.addClass("gridsheet_document_name");
            $input.attr("placeholder","Document Title");
            $input.val(this.documentObj.name);
            $input.appendTo(toolBarDiv);
            /* adding event listeners for the toolbar */
            this.addEventListenerForToolbar(toolBarDiv);
            
        },
        addEventListenerForToolbar:function(toolBarDiv) {
            self=this;
            toolBarDiv.children('gridsheet_document_name').change(function(event){
                self.documentObj.name=$(this).val();
            });
        },
        initDocumentData:function()
        {
            LOG.debug('Entering initDocumentData() ');

           
            if(this.options.documentObj)
            {
                /*creating the document object*/
                this.documentObj=this.options.document;
            }
            else
            {
                /*creating the document object*/
                this.documentObj=new Document();

                this.documentObj.name=this.options.documentName;

                /*initializing the sheets */
                this.documentObj.sheets=[];
            
                /*creating sheet data for the document*/
                var i=0;
                while(i<this.options.sheets)
                {
                    LOG.info('Creating empty sheet data for sheet number - ' +(i+1));
                    this.documentObj.sheets.push(this.createSheetObj(i,this.options.rows,this.options.columns));      
                    i++;
                }

            }
            
            LOG.info('Finished creating the sheet data for the document');
            
        },
        createSheetObj:function(sheetNum,rows,columns)
        {
            LOG.debug('Entering createSheetObj() ');
            /*creating the sheet and populating empty data in the sheets*/
            
                var sheet=new Sheet();
                sheet.name=CONSTANTS['SHEET_PREFIX']+(sheetNum+1);
                sheet._columnCount=columns;
                sheet._rowCount=rows;
                sheet.sheetNumber=sheetNum+1;
                /*creating the 2D array for holding cell data*/
                sheet.sheetData=this.createSheetData(sheet,rows,columns);
                return sheet;
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

            var sheetData=new Array(rows);
            for(i=0;i<rows;i++)
            {
                sheetData[i]=new Array(columns);
            }
            /*creating empty data in the cells.*/
            sheetData= this.feedEmptyDataIntoNewCellsForSheet(sheetData);
            return sheetData;
        },
        feedEmptyDataIntoNewCellsForSheet:function(sheetData)
        {
            LOG.debug('Entering feedEmptyDataIntoNewCellsForSheet() ');
            /*iterating through the 2D Array and assigning the sheet cell object in the sheet data 2D array*/
            for(i=0;i<sheetData.length;i++)
            {
                for(j=0;j<sheetData[i].length;j++)
                {
                    var cell=new SheetCell();
                    sheetData[i][j]=this.createSheetCellWithData(cell,i,j,'',CONSTANTS['DATATYPE_TEXT']);
                    
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
            cell.properties=this.addDefaultPropertiesForSheetCell(cell);
            return cell;
        },
        addDefaultPropertiesForSheetCell:function(cell)
        {
            var props=new CellProperties();
            props.styleClasses=[];
            props.styleClasses.push('gridsheet_cell');
            /*assigning the calculated width and height to the cell data as properties for the cell*/
            props.columnWidth=this.options._columnWidth;
            props.rowHeight=this.options._rowHeight;
            props.formula=null;
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
        generateDocumentUI:function()
        {
            LOG.debug('Entering generateDocumentUI() ');
            var firstSheet=true;
            /*iterating through sheets to create the DOM structure for every sheet*/
            for(var i=0;i<this.documentObj.sheets.length;i++)
            {
                this.generateSheetUI(this.documentObj.sheets[i]);
            }
        },
        generateSheetUI:function(sheet)
        {
            LOG.debug('Entering generateSheetUI() ');
            /*creates the DOM container for the a sheet in the document*/
            this.createSheetDomContainer(sheet);
            /*creating the sheet button that helps a user switch from one sheet to another*/
            this.createSheetNavigationButton(sheet);
            /* generate the gutter column*/
            this.generateGutterColumn(sheet);
            /* generate DOM content for the cells in the sheet*/
            this.renderDataColumns(sheet);
            /* creating dummy floating top bar for improving UI usability*/
            this.createDummyGutterContentForUIUsability(sheet);
            

        },
        createDummyGutterContentForUIUsability:function(sheet)
        {
             LOG.debug('Entering createDummyGutterContentForUIUsability() ');
            
             /*generating a fake top bar for a sheet for better usability on the UI*/
            this.createDummyGutterContentTopBarUIUsability(sheet);
            this.createDummyGutterContentSideBarUIUsability(sheet);
            
        },
        createDummyGutterContentSideBarUIUsability:function(sheet)
        {
            LOG.debug('Entering createDummyGutterContentSideBarUIUsability() ');
            /* cloning the existing side bar */
            $ul=sheet.domContainer.children('ul').eq(0).clone();
            /* determining the first cell height to render the dummy side bar below the dummy top bar*/
            firstCellHeight=$ul.children("li").height()+2;
            /* now remove the first cell as this was already captured in the dummy top bar*/
            $ul.children("li").eq(0).remove();
            /* adding more styling to provide positioning */
            $ul.addClass('gridsheet_dummy_sidebar');
            $ul.addClass('gridsheet_column');
            /* top position alignment for rendering the side bar just below the top bar.*/
            $ul.css({'top':firstCellHeight+'px'});
            /* adding the side bar to the sheet container */
            $ul.appendTo(sheet.domContainer);
            
            /* adding scroll event handler to the side bar to detect the scroll left postion and render the side bar appropriately*/
            this.addScrollEventForDummySideBarContainer(sheet.domContainer);

        },
        addScrollEventForDummySideBarContainer:function(sheetDomContainer){

            LOG.debug('Entering addScrollEventForDummySideBarContainer() ');
             /* monitoring the scroll event for the sheet container*/
            sheetDomContainer.scroll(function(event){
                /* if scroll left is zero then just hide the side bar. if the scroll left is not zero(active scrolling) then postion the side bar appropriately */
                if(sheetDomContainer.scrollLeft()!=0)
                {
                    sheetDomContainer.children('.gridsheet_dummy_sidebar').show();
                    sheetDomContainer.children('.gridsheet_dummy_sidebar').css({'left':(sheetDomContainer.scrollLeft()+CONSTANTS['SCROLL_LEFT_OFFSET'])+'px'});
                }
                else
                {
                    sheetDomContainer.children('.gridsheet_dummy_sidebar').hide();  
                }               

            });
        },
        createDummyGutterContentTopBarUIUsability:function(sheet)
        {
            LOG.debug('Entering createDummyGutterContentTopBarUIUsability() ');
            /* creating a ul that will show up horizontally rather than a usual vertical data column*/
            /* will be using this horizontal bar to represent the column headings and will behave like a sticky header when the user scrolls*/
            div=document.createElement('div');
            $div=$(div);
            /* adding the class for proper horizontal styling and positioning */
            $div.addClass('gridsheet_dummy_topbar');
            /* adding z-index so the top bar is always floating above the dummy side bar */
            $div.css({'z-index':CONSTANTS['DUMMY_TOP_BAR_Z_INDEX']});
            /* storing the total width of all column headers that we will use for the total width of the horizontal bar*/
            totalLiWidth=0;
            firstLiWidth=0;
            isFirstColumn=true;
            sheet.domContainer.children('ul').clone().appendTo($div);
            $div.children('ul').each(function() {
               $(this).children('li').eq(0).nextAll().remove();
               totalLiWidth+=$(this).width();
            });
            //totalLiWidth+=firstLiWidth;
            /* setting the total width to the horizontal bar*/
            $div.width(totalLiWidth);
            $div.height($div.children('ul').first().children('li').first().height());
            /* appending the top bar to the sheet */
            $div.appendTo(sheet.domContainer);
            /* adding the scroll event handler for the positioning the top floating bar */
            this.addScrollEventForDummyTopBarContainer(sheet.domContainer);
            
        },
        addScrollEventForDummyTopBarContainer:function(sheetDomContainer)
        {
             LOG.debug('Entering addScrollEventForDummyTopBarContainer() ');
             /* monitoring the scroll event for the sheet container*/
            sheetDomContainer.scroll(function(event){
                /* if scroll top is zero then just hide the top bar. if the scroll top is not zero(active scrolling) then postion the top bar appropriately */
                if(sheetDomContainer.scrollTop()>0)
                {
                    sheetDomContainer.children('.gridsheet_dummy_topbar').show();
                    sheetDomContainer.children('.gridsheet_dummy_topbar').css({'top':(sheetDomContainer.scrollTop()+CONSTANTS['SCROLL_TOP_OFFSET'])+'px'});
                }
                else
                {
                    sheetDomContainer.children('.gridsheet_dummy_topbar').hide();  
                }
                

            });
        },
        renderDataColumns:function(sheet)
        {
            LOG.debug('Entering renderDataColumns() ');
            var styleClasses={'styleClasses':['gridsheet_cell']};
            var styleClassesForFirstCell={'styleClasses':['gridsheet_cell','gridsheet_content_align_center','gridsheet_gutter']};
            
            for(var i=0;i<sheet._columnCount;i++)
            {
                 this.generateColumn(sheet,i,styleClassesForFirstCell,styleClasses);
            }

        },
        createSheetNavigationButton:function(sheet)
        {
            LOG.debug('Entering createSheetTabButton() ');
            button=document.createElement('button');
            var $button=$(button);
            $button.addClass('gridsheet_sheet_tab_button');
            $button.text(sheet.name);
            $button.attr('sheetnumber',sheet.sheetNumber);
            /* on initial load the first sheet will be active others inactive*/
            if(sheet.sheetNumber>1)
            {
                 $button.addClass('gridsheet_sheet_tab_button_inactive');
            }
            else
            {
                 $button.addClass('gridsheet_sheet_tab_button_active');
            }
            /*positioning the button to stick to the sheet this sheet navigation button is for*/
            $button.css({'top':(sheet.domContainer.height()+1),'left':((sheet.sheetNumber-1)*CONSTANTS['SHEET_BUTTON_WIDTH'])});
            this.addEventHandlersForSheetNavigationButtons($button);
            sheet.domContainer.after($button);
        },
        addEventHandlersForSheetNavigationButtons:function(button)
        {
            LOG.debug('Entering addEventHandlersForSheetNavigationButtons() ');
            /*click handler for the sheet navigation button*/
            var self=this;
             button.click(function(event){self.createSheetNavigationButtonClickEventHandler(event,self);});
             button.dblclick(function(event){self.createSheetNavigationButtonDblClickEventHandler(event,self);});
             /*this function could also accomodate other event handlers as required*/
        },
        createSheetNavigationButtonDblClickEventHandler:function(event,self)
        {
            /*handling the doulble click event for the sheet name change when the sheet navigation button is clicked*/
            LOG.debug('Entering createSheetNavigationButtonDblClickEventHandler() ');
            /*create a input of type text*/
            var textbox=document.createElement('input');
            textbox.type='text';
            /*copy the value of the sheet name on the sheet navigation button*/
            textbox.value=$(event.target).text();
            $textbox=$(textbox);
            /*setting the dimensions for the textbox being added*/
            $textbox.width($(event.target).width()-1).height($(event.target).height()-1);
            /*setting the sheet number to the textbox for referencing the sheet in the documentObj and update the name*/
            $textbox.attr("sheetnumber",$(event.target).attr("sheetNumber"));
            /*empty the text in the sheet navigation button to make space for the textbox to be added*/
            $(event.target).text('');
            /* adding the event handler for the textbox*/
            self.addEventHandlersForSheetNameTextbox($textbox);
            /* appending the textbox to the sheet navigation button*/
            $(event.target).append($textbox);
            /*setting the focus to the textbox for the user to edit the sheet name*/
            $textbox.focus();

        },
        addEventHandlersForSheetNameTextbox:function(textbox)
        {
            LOG.debug('Entering addEventHandlersForSheetNameTextbox() ');
            var self=this;
            /* adding the event handler for the text box when the focus goes out from the textbox. this is the event where we update the sheet name */
            textbox.focusout(function(event){self.sheetNameTextBoxFocusOutEventHandler(event,self);});

        },
        sheetNameTextBoxFocusOutEventHandler:function(event,self)
        {
            LOG.debug('Entering sheetNameTextBoxFocusOutEventHandler() ');
            /* fetching the new value from the textbox.*/
            var text=$(event.target).val();
            /*fetching the old value for the sheet name*/
            var oldValue=$(event.target).parent().text();
            LOG.info('Sheet number where name is being changed :'+$(event.target).attr("sheetnumber"));
            var sheetNumber=parseInt($(event.target).attr('sheetnumber'));
            /*updating the sheet name in the documentObj by validating if the sheetnumber was a valid sheet number*/
            if(sheetNumber>0 && sheetNumber<=self.documentObj.sheets.length)
            {
                self.documentObj.sheets[sheetNumber-1].name=text;
                LOG.info('New Name for the sheet is :'+self.documentObj.sheets[sheetNumber-1].name);
                $(event.target).parent().text(text);    
            }
            else
            {
                /*if the sheet number is invalid then restoring the old name for the sheet navigation button*/
                $(event.target).parent().text(oldValue);
                LOG.error("Cannot update the Name for sheet number less than 1");
            }
            /*unbind the event handler for the textbox for editing the sheet name and removing the textbox after updation of the sheet name*/
            $(event.target).unbind().remove();            
        },
        createSheetNavigationButtonClickEventHandler:function(event,self)
        {
            LOG.debug('Entering createSheetNavigationButtonClickEventHandler() ');
            /* if the sheet navigation button is inactive then change it to active and show the corresponding sheet. also hide the other sheets from view*/
            if($(event.target).hasClass('gridsheet_sheet_tab_button_inactive'))
            {
                /*hiding all the sheets*/
                $('.gridsheet_sheet').hide();
                /*setting all the sheet navigation buttons to inactive*/
                $('.gridsheet_sheet_tab_button_active').addClass('gridsheet_sheet_tab_button_inactive').removeClass('gridsheet_sheet_tab_button_active');
                /*showing the current selected sheet in view*/
                $(event.target).prev().show();
                /*setting the current sheet navigation button to active styling*/
                $(event.target).addClass('gridsheet_sheet_tab_button_active').removeClass('gridsheet_sheet_tab_button_inactive');

            }

        },
        createSheetDomContainer:function(sheet)
        {
            LOG.debug('Entering createSheetDomContainer() ');
            var $documentContainer=this.$element.children('.gridsheet_document_container').eq(0);
            /*creating DIV container for each sheet*/
            sheetDom=document.createElement('div');
            $sheet=$(sheetDom);
            /*setting dimensions for the sheet dom container*/
            $sheet.width($documentContainer.width()-($documentContainer.width()*0.005));
            $sheet.height($documentContainer.height()-($documentContainer.height()*0.10));
            /*first sheet should not be hidden from the view, others should be hidden*/
            if(sheet.sheetNumber>1)
            {
                $sheet.addClass('gridsheet_sheet_hide');
            }
            /* adding styling to the cell*/
            $sheet.addClass('gridsheet_sheet');
            $sheet.addClass(CONSTANTS['SHEET_CSS_PREFIX']+CONSTANTS['CSS_NAMING_SEPARATOR']+sheet.sheetNumber);
            this.$element.children('.gridsheet_document_container').eq(0).append($sheet);
            /*associating DOM container with the sheet*/
            sheet.domContainer=$sheet;
            $sheet.data(sheet);
            return $sheet;

        },
        generateGutterColumn:function(sheet){
              LOG.debug('Entering generateGutterColumn() ');
            var styleClassesForFirstCell={'styleClasses':['gridsheet_cell','gridsheet_content_align_center','gridsheet_gutter']};
            var styleClassesForCell={'styleClasses':['gridsheet_cell','gridsheet_content_align_center','gridsheet_gutter']};
            this.generateColumn(sheet,-1,styleClassesForFirstCell,styleClassesForCell);
        },
        generateColumn:function(sheet,columnNumber,styleClassesForFirstCell,styleClassesForCell){
             LOG.debug('Entering generateColumn() ');
            var $ul=this.createGridSheetColumn(sheet,columnNumber);
            isFirstRow=true;
            /*styling for the gutter column needs to be different to make them look different than the actual cells on the sheet*/
            var $li=null;
            for(i=0;i<(sheet._rowCount+1);i++)
            {   /*the first cell on the gutter column does not have a label*/             
                if(isFirstRow)
                {
                    isFirstRow=!isFirstRow;
                    if(columnNumber<0)
                    {
                        $li=this.appendGridSheetCellToColumn($ul,this.createSheetCellWithData(new SheetCell(),i,columnNumber,'',CONSTANTS['DATATYPE_TEXT']),styleClassesForFirstCell);
                    }
                    else
                    {
                        $li=this.appendGridSheetCellToColumn($ul,this.createSheetCellWithData(new SheetCell(),i,columnNumber,this.getColumnNameForColumnNumber(columnNumber+1),CONSTANTS['DATATYPE_TEXT']),styleClassesForFirstCell);
                    }
                    
                }
                else
                {
                    if(columnNumber<0)
                    {
                        $li=this.appendGridSheetCellToColumn($ul,this.createSheetCellWithData(new SheetCell(),i,columnNumber,i,CONSTANTS['DATATYPE_TEXT']),styleClassesForCell);
                    }
                    else
                    {
                        $li=this.appendGridSheetCellToColumn($ul,this.createSheetCellWithData(new SheetCell(),i,columnNumber,'',CONSTANTS['DATATYPE_TEXT']),styleClassesForCell);
                    }
                    
                }
            }
                     
            return $ul;
        },
        createGridSheetColumn:function(sheet,columnNumber)
        {
            LOG.debug('Entering createGridSheetColumn() ');
            ul=document.createElement('ul');
            $ul=$(ul);
            $ul.addClass('gridsheet_column');
            $ul.width(this.options._columnWidth);
            $ul.height(this.options._currentRowCount*this.options._rowHeight);            
            $ul.data({'columnNumber':columnNumber});            
            sheet.domContainer.append($ul);
            if(columnNumber<0)
            {
                $ul.css({'left':'0px'});
            }
            else
            {
                $ul.css({'left':(((columnNumber+1)*this.options._columnWidth))+'px'});
            }
            return $ul;
        },
        appendGridSheetCellToColumn:function(list,sheetCell,props)
        {
            LOG.debug('Entering appendGridSheetCellToColumn() ');
            sheetCell.properties=$.extend({}, sheetCell.properties, props);
            li=document.createElement('li');
            var $li=$(li);
            this.addPropertiesToGridSheetCellDOM($li,sheetCell);
            list.append($li);
            return $li;
        },
        addPropertiesToGridSheetCellDOM:function(cell,sheetCell)
        {
            LOG.debug('Entering addPropertiesToGridSheetCellDOM() ');
            cell.attr('class',sheetCell.properties.styleClasses.join(' '));
            cell.addClass(CONSTANTS['CELL_CSS_PREFIX']+sheetCell.dataLabel);
            cell.data({'data':sheetCell});
            cell.width(sheetCell.properties.columnWidth-1);
            cell.height(sheetCell.properties.rowHeight-1);
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
                var cellDom=null;
                cellDom=document.createElement('div');
                var $cellDom=$(cellDom);
                
                 if(sheetCell.properties.styleClasses.includes('gridsheet_gutter'))
                {
                    $cellDom.text(sheetCell.data);

                    var draggerX=document.createElement('div');
                    this.addEventListenerForColumnDragger(draggerX);
                    $draggerX=$(draggerX);
                    $draggerX.addClass('gridsheet_column_dragger');
                    $draggerX.attr('draggable',"true");
                    $draggerX.width((cell.width()*0.10)-1).height(cell.height()-1);

                    var draggerY=document.createElement('div');
                    $draggerY=$(draggerY);
                    this.addEventListenerForRowDragger(draggerY);
                    $draggerY.addClass('gridsheet_row_dragger');
                    $draggerY.attr('draggable',"true");
                    $draggerY.width((cell.width()*0.80)-1).height((cell.height()*0.20)-1);

                    $cellDom.width((cell.width()*0.80)-1).height((cell.height()*0.80)-1);
                    cell.append($cellDom);
                    cell.append($draggerY);
                    cell.append($draggerX);
                    
                    
                }
                else
                {
                    $cellDom.text(sheetCell.data);
                    $cellDom.width(cell.width()-1).height(cell.height()-1);
                    cell.append($cellDom);
                    
                }
                 
                this.addEventListenerForCell($cellDom,sheetCell);
                break;
            }
        },
        addEventListenerForColumnDragger:function(draggerX)
        {
            self=this;
            draggerX.addEventListener("dragend", function( event ) {
                
                            var $draggerX=$(draggerX);
                            
                            self.resizeColumnWithWidth($draggerX,event);

                    }, false);
        },
        addEventListenerForRowDragger:function(draggerY)
        {
           
            draggerY.addEventListener("dragend", function( event ) {
                
                            var $draggerY=$(draggerY);
                            
                            self.resizeRowWithHeight($draggerY,event);

                    }, false);
        },
        resizeRowWithHeight:function(rowDragger,event)
        {
            console.log("distance dragged",(event.pageY-rowDragger.offset().top));
            var distanceDragged=0;
            if((event.pageY-rowDragger.offset().top)>0)
            {
                distanceDragged=(event.pageY-rowDragger.offset().top);
            }
            else
            {
                distanceDragged=-(event.pageY-rowDragger.offset().top);
            }

            if(distanceDragged>(rowDragger.parent().height()/4))
            {
                console.log("new height",rowDragger.parent().height(), rowDragger.parent().height()+(event.pageY-rowDragger.offset().top));
                rowDragger.parent().height(rowDragger.parent().height()+(event.pageY-rowDragger.offset().top));
              /* columnDragger.parent().parent().children('li').width(columnDragger.parent().parent().width()-1);
                
                var leftPositionTillCurrentColumn=columnDragger.parent().parent().position().left;
                var widthOfModifiedColumn=columnDragger.parent().parent().width();

                var leftStartPoint=leftPositionTillCurrentColumn+widthOfModifiedColumn;
                columnDragger.parent().parent().nextAll().each(function(ele){
                    $(this).css({'left':(leftStartPoint)+'px'});
                    leftStartPoint+=$(this).width();

                });*/
            }
            
        },
        resizeColumnWithWidth:function(columnDragger,event)
        {
            var distanceDragged=0;
            if((event.pageX-columnDragger.offset().left)>0)
            {
                distanceDragged=(event.pageX-columnDragger.offset().left);
            }
            else
            {
                distanceDragged=-(event.pageX-columnDragger.offset().left);
            }

            if(distanceDragged>(columnDragger.parent().parent().width()/4) && (columnDragger.parent().parent().width()+(event.pageX-columnDragger.offset().left))>(columnDragger.parent().parent().width()/4))
            {
               
                columnDragger.parent().parent().width(columnDragger.parent().parent().width()+(event.pageX-columnDragger.offset().left));
                columnDragger.parent().parent().children('li').width(columnDragger.parent().parent().width()-1);
                
                var leftPositionTillCurrentColumn=columnDragger.parent().parent().position().left;
                var widthOfModifiedColumn=columnDragger.parent().parent().width();

                var leftStartPoint=leftPositionTillCurrentColumn+widthOfModifiedColumn;
                columnDragger.parent().parent().nextAll().each(function(ele){
                    $(this).css({'left':(leftStartPoint)+'px'});
                    leftStartPoint+=$(this).width();

                });
            }
            
        },
        addEventListenerForCell:function(cellDom,sheetCell)
        {
            self=this;
            cellDom.dblclick(function(event){
               LOG.info('This is still to be implemented.');
               /*need to add an editor with a lot of capability*/

            });

        },
        setDimensionsForContainer:function () {
            LOG.debug('Entering setDimensionsForContainer() ');
            /*setting the dimension for the container after calculation*/
            LOG.info('container width '+ this.options._width);
            LOG.info('container height '+this.options._height);
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
            this.options._documentWidth=$(window).width()-($(window).width()*0.02);
            //this.options._documentHeight=$(document).height()-($(document).height()*0.02);
            this.options._documentHeight=$(window).height();
            /*if the dimension is percentage or em based in the config then convert then to 
               pixel values as pixel values will be the based for all the calculations in this plugin*/
               /*first calculation for the width*/
            if(this.isPercentageValue(this.options.width))
            {
                this.options._width=this.getFloatValue((this.options._width/100)*this.options._documentWidth);
            }
            else if(this.isEmValue(this.options.width))
            {
                this.options._width=this.getFloatValue(this.options._width/CONSTANTS['ONEPX2EM']);
            }
            /*now calculation for the height*/
            if(this.isPercentageValue(this.options.height))
            {
               this.options._height=this.getFloatValue((this.options._height/100)*this.options._documentHeight);
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

            /*plugin.$element.on('click' + '.' + plugin._name, function() {
                LOG.info('clicked the component');
                plugin.someOtherFunction.call(plugin);
            });*/
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
        width: '80%',
        height: '80%',
        columns:30,
        rows:500,
        _columnWidth:100,
        _rowHeight:30,
        sheets:3,
        onComplete: null,
        documentName:'Untitled Document',
        document:null,
        onImportDone:function(documentObj){ LOG.info('Default on Import Done event');},
        onSave:function(documentObj){LOG.info('Default on save Event');}
    };

})(jQuery, window, document); 