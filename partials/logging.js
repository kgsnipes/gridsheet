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