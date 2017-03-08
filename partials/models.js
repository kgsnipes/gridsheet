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
    