var RootLayer = cc.Layer.extend({

    ctor: function ()
    {
        this._super();
    },

    onEnter: function ()
    {
        this._super();

        if (GCfg.init)
        {
            GCfg.init();
        }

        GMapMgr = new MapManager();
        this.addChild(GMapMgr);
        GPageMgr = new PageManager();
        this.addChild(GPageMgr);
        if (typeof GStart_Page !== 'undefined')
        {
            GPageMgr.openPage(GStart_Page);
        }
        else
        {
            GPageMgr.openPage("Page_Start");
        }

    },

    onExit: function ()
    {
        this._super();
        cc.log("RootLayer has exit!");
    }
});