        ,
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
        }