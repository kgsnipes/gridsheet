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
        updateDummyGutterContentTopBarUIUsability:function(sheetNumber,columnNumber,distanceDragged)
        {
            $sheetDomContainer=this.documentObj.sheets[sheetNumber-1].domContainer;
            if($sheetDomContainer.find('gridsheet_dummy_topbar').length>0)
            {
              LOG.warn('need to implement here');
            }

        },
        createDummyGutterContentTopBarUIUsability:function(sheet)
        {
            LOG.debug('Entering createDummyGutterContentTopBarUIUsability() ');
            /* creating a ul that will show up horizontally rather than a usual vertical data column*/
            /* will be using this horizontal bar to represent the column headings and will behave like a sticky header when the user scrolls*/
            div=document.createElement('div');
            $div=$(div);
            /* adding the class for proper horizontal styling and positioning */
            $div.addClass(CONSTANTS['CSS_GRIDSHEET_DUMMY_TOPBAR']);
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
                    sheetDomContainer.children('.'+CONSTANTS['CSS_GRIDSHEET_DUMMY_TOPBAR']).show();
                    sheetDomContainer.children('.'+CONSTANTS['CSS_GRIDSHEET_DUMMY_TOPBAR']).css({'top':(sheetDomContainer.scrollTop()+CONSTANTS['SCROLL_TOP_OFFSET'])+'px'});
                }
                else
                {
                    sheetDomContainer.children('.'+CONSTANTS['CSS_GRIDSHEET_DUMMY_TOPBAR']).hide();  
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
            var $documentContainer=this.$element.children('.'+CONSTANTS['CSS_DOCUMENT_CONTAINER']).eq(0);
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
            $sheet.addClass(CONSTANTS['GRIDSHEET_CSS_SHEET']);
            $sheet.addClass(CONSTANTS['SHEET_CSS_PREFIX']+CONSTANTS['CSS_NAMING_SEPARATOR']+sheet.sheetNumber);
            this.$element.children('.'+CONSTANTS['CSS_DOCUMENT_CONTAINER']).eq(0).append($sheet);
            /*associating DOM container with the sheet*/
            sheet.domContainer=$sheet;
            $sheet.data(sheet);
            return $sheet;

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
        }
        
