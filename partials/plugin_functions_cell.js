        ,
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
            self=this;
            console.log("distance dragged",(event.pageY-rowDragger.offset().top));
            var distanceDragged=0;
            var distanceDraggedMeasure=0;
            if((event.pageY-rowDragger.offset().top)>0)
            {
                distanceDraggedMeasure=(event.pageY-rowDragger.offset().top);
                distanceDragged=(event.pageY-rowDragger.offset().top);
            }
            else
            {
                distanceDraggedMeasure=-(event.pageY-rowDragger.offset().top);
                distanceDragged=(event.pageY-rowDragger.offset().top);
            }

            if(distanceDraggedMeasure>(rowDragger.parent().height()/4))
            {
                var rowDraggerLi=rowDragger.parent();
                var rowDraggerUl=rowDragger.parent().parent();
                var rowIndex=rowDragger.parent().index();
                var heightOfModifiedRow=0;
                if(rowIndex>-1)
                {
                    
                    rowDraggerUl.parent().children("ul").each(function(){
                        $this=$(this);
                        if(!($this.hasClass('gridsheet_dummy_sidebar') || $this.hasClass('gridsheet_dummy_topbar')))
                        {
                            var rowLi=$this.children('li').eq(rowIndex);
                            rowLi.height(rowLi.height()+distanceDragged);
                            rowLi.children('div').eq(0).height(rowLi.children('div').eq(0).height()+distanceDragged);
                            rowLi.children('div').eq(2).height(rowLi.children('div').eq(2).height()+distanceDragged).css({'margin-top':(self.getMeasurementValue(rowLi.children('div').eq(2).css('margin-top'))-distanceDragged)+'px'});
                        }

                    });

                    this.updateSheetWithRowHeightForRow(rowDragger,distanceDragged,heightOfModifiedRow);
                }


            }
            
        },
         updateSheetWithRowHeightForRow:function(rowDragger,distanceDragged,heightOfModifiedRow){
              /*  var sheetNumber=0;
                var columnNumber=columnDragger.parent().parent().parent().children('ul').index(columnDragger.parent().parent())
                LOG.info('index of parent on sheet'+columnNumber);
                var sheetNamingPrefix=CONSTANTS['SHEET_CSS_PREFIX']+CONSTANTS['CSS_NAMING_SEPARATOR'];
                if(columnDragger.parent().parent().parent().hasClass(CONSTANTS['GRIDSHEET_CSS_SHEET']))
                {
                    LOG.info('inside sheet');
                    var sheetClasses=columnDragger.parent().parent().parent().attr('class').split(' ');
                    LOG.info(sheetClasses);
                    if(sheetClasses)
                    {
                        for(var i=0;i<sheetClasses.length;i++)
                        {
                            if(sheetClasses[i].indexOf(sheetNamingPrefix)!=-1)
                            {
                                
                                sheetNumber=sheetClasses[i].substring(sheetClasses[i].lastIndexOf(CONSTANTS['CSS_NAMING_SEPARATOR'])+1,sheetClasses[i].length);
                                break;
                            }
                        }
                    }
                }
                if(sheetNumber>0 && columnNumber>0)
                {
                    LOG.info('sheet number is :'+ sheetNumber);
                    LOG.info('setting the column width for the column adjusted')
                    for(i=0;i<this.documentObj.sheets[sheetNumber-1].sheetData.length;i++)
                    {
                        this.documentObj.sheets[sheetNumber-1].sheetData[i][columnNumber-1].properties.columnWidth=parseInt(widthOfModifiedColumn);

                    }
                    this.updateDummyGutterContentTopBarUIUsability(sheetNumber,columnNumber,distanceDragged);

                }*/

        },
        resizeColumnWithWidth:function(columnDragger,event)
        {

            var distanceDragged=0;
            var distanceDraggedMeasure=0;
            if((event.pageX-columnDragger.offset().left)>0)
            {
                distanceDraggedMeasure=(event.pageX-columnDragger.offset().left);
                distanceDragged=(event.pageX-columnDragger.offset().left);
            }
            else
            {
                distanceDraggedMeasure=-(event.pageX-columnDragger.offset().left);
                distanceDragged=(event.pageX-columnDragger.offset().left);
            }

            if(distanceDraggedMeasure>(columnDragger.parent().parent().width()/4) && (columnDragger.parent().parent().width()+(event.pageX-columnDragger.offset().left))>(columnDragger.parent().parent().width()/4))
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
                $columnLabelDiv=columnDragger.parent().find('div').eq(0);
                $columnLabelDiv.width($columnLabelDiv.width()+distanceDragged);
                $rowDraggerDiv=columnDragger.parent().find('div').eq(1);
                $rowDraggerDiv.width($rowDraggerDiv.width()+distanceDragged);

                this.updateSheetWithColumnWidthForColumn(columnDragger,distanceDragged,widthOfModifiedColumn);

            }
            
        },
        updateSheetWithColumnWidthForColumn:function(columnDragger,distanceDragged,widthOfModifiedColumn){
                var sheetNumber=0;
                var columnNumber=columnDragger.parent().parent().parent().children('ul').index(columnDragger.parent().parent())
                LOG.info('index of parent on sheet'+columnNumber);
                var sheetNamingPrefix=CONSTANTS['SHEET_CSS_PREFIX']+CONSTANTS['CSS_NAMING_SEPARATOR'];
                if(columnDragger.parent().parent().parent().hasClass(CONSTANTS['GRIDSHEET_CSS_SHEET']))
                {
                    LOG.info('inside sheet');
                    var sheetClasses=columnDragger.parent().parent().parent().attr('class').split(' ');
                    LOG.info(sheetClasses);
                    if(sheetClasses)
                    {
                        for(var i=0;i<sheetClasses.length;i++)
                        {
                            if(sheetClasses[i].indexOf(sheetNamingPrefix)!=-1)
                            {
                                
                                sheetNumber=sheetClasses[i].substring(sheetClasses[i].lastIndexOf(CONSTANTS['CSS_NAMING_SEPARATOR'])+1,sheetClasses[i].length);
                                break;
                            }
                        }
                    }
                }
                if(sheetNumber>0 && columnNumber>0)
                {
                    LOG.info('sheet number is :'+ sheetNumber);
                    LOG.info('setting the column width for the column adjusted')
                    for(i=0;i<this.documentObj.sheets[sheetNumber-1].sheetData.length;i++)
                    {
                        this.documentObj.sheets[sheetNumber-1].sheetData[i][columnNumber-1].properties.columnWidth=parseInt(widthOfModifiedColumn);

                    }
                    this.updateDummyGutterContentTopBarUIUsability(sheetNumber,columnNumber,distanceDragged);

                }

        },
        addEventListenerForCell:function(cellDom,sheetCell)
        {
            self=this;
            cellDom.dblclick(function(event){
               LOG.info('This is still to be implemented.');
               /*need to add an editor with a lot of capability*/

            });

        }