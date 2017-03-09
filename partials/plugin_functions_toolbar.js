		,
        createToolBarUI:function (toolBarDiv) {
            LOG.debug('Entering createToolBarUI() ');
            $input=$(document.createElement('input'));
            $input.attr("type","text");
            $input.addClass(CONSTANTS['CSS_GRIDSHEET_DOCUMENT_NAME']);
            $input.attr("placeholder",CONSTANTS['GRIDSHEET_DEFAULT_DOCUMENT_NAME_PLACEHOLDER']);
            $input.val(this.documentObj.name);
            $input.appendTo(toolBarDiv);
            /* adding event listeners for the toolbar */
            this.addEventListenerForToolbar(toolBarDiv);
            
        },
        addingToolBarAndDocumentContainer:function () {
            
             LOG.debug('Entering addingToolBarAndDocumentContainer() ');
             /* defining the document container with 80% height of the gridsheet plugin*/
            var $documentContainer=$(document.createElement('div'));
            $documentContainer.addClass(CONSTANTS['CSS_DOCUMENT_CONTAINER']).width(this.$element.width()).height(this.$element.height()*0.80);

            /* defining the toolbar for the gridsheet plugin with 20% of the height */
            var $toolBarDiv=$(document.createElement('div'));
            $toolBarDiv.addClass(CONSTANTS['CSS_GRIDSHEET_TOOLBAR']).width(this.$element.width()-(this.$element.width()*0.01)).height(this.$element.height()*0.20);
            this.createToolBarUI($toolBarDiv);
            /* adding the toolbar to the gridsheet plugin dom*/
            this.$element.append($toolBarDiv);
            /* adding the documentContainer to the gridsheet plugin dom*/
            this.$element.append($documentContainer);
        },
        addEventListenerForToolbar:function(toolBarDiv) {
            LOG.debug('Entering addEventListenerForToolbar() ');
            self=this;
            toolBarDiv.children('gridsheet_document_name').change(function(event){
                self.documentObj.name=$(this).val();
            });
        }