        
        ,/*converts a number corrected to 2 decimal places*/
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
            
        }