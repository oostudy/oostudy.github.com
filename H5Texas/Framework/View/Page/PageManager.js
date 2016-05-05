var PageManager=cc.Node.extend({
    _tempZ:0,
    _pages:{},
    ctor:function()
    {
        this._super();
        this._tempZ=0;
        this._pages={};
    },

    openPage:function(pageName,params)
    {
        ++this._tempZ;
        var page = this._pages[pageName];
        if(page)
        {
            page.setLocalZOrder(this._tempZ);
            return page;
        }
        cc.log("new " + pageName + "()......................!");
        var page = eval("new " + pageName + "();");
        this.addChild(page, this._tempZ);
        this._pages[pageName] = page;
        page.onOpen(params);
        return page;
    },

    closePage:function(pageName,params)
    {
        var page = this._pages[pageName];
        if(!page)
        {
            return false;
        }
        this._pages[pageName] = null;
        page.onClose(params);
        page.removeFromParent();
        return true;
    },

    refreshPage:function(pageName,params)
    {
        var page = this._pages[pageName];
        if(!page)
        {
            return false
        }
        page:refresh(params)
    },

    showPage:function(pageName,params)
    {
        var page = this._pages[pageName];
        if(!page || page.isVisible())
        {
            return false;
        }
        page:setVisible(true);
        page:onShow(params);
    },

    hidePage:function(pageName,params)
    {
        var page = this._pages[pageName];
        if(!page || !page.isVisible())
        {
            return false
        }
        page.setVisible(false);
        page.onHide(params);
    },

    isPageOpened:function(pageName)
    {
        var page = this._pages[pageName]
        if(!page)
        {
            return false;
        }
        return true;
    },

    getPage:function(pageName)
    {
        return this._pages[pageName];
    },

    onExit:function()
    {
        this._super();
        cc.log("PageManager has exit!");
    }
});

GPageMgr = null;
