
var GameScene = cc.Scene.extend(
    {
        ctor:function()
        {
            this._super();
            this.setAnchorPoint(cc.p(0.5,0.5));
        },

        onEnter:function()
        {
            this._super();
            GTriggerMgr.init();
            if (cc.sys.isNative)
            {
                jsb.fileUtils.addSearchPath("res/" + GCfg.App_Name + "/");
            }
            this.addChild(new RootLayer);
        },

        onExit:function()
        {
            this._super();
        }
});