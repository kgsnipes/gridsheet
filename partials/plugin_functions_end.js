        ,
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


        },/*creating the loader dom*/
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

  