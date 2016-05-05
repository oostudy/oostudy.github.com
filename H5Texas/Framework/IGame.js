var IGame = cc.Class.extend("IGame", {
    ctor: function ()
    {
        if (!cc.sys.isNative && document.getElementById("cocosLoading")) //If referenced loading.js, please remove it
            document.body.removeChild(document.getElementById("cocosLoading"));

        // Pass true to enable retina display, disabled by default to improve performance
        cc.view.enableRetina(false);
        // Adjust viewport meta
        cc.view.adjustViewPort(true);
        // Setup the resolution policy and design resolution size
        //cc.view.setDesignResolutionSize(cc.game.config.designWidth, cc.game.config.designHeight, cc.ResolutionPolicy.SHOW_ALL);
        //cc.view.setFrameSize(cc.game.config.width, cc.game.config.height);
        //cc.view.setFrameZoomFactor(cc.game.config.frameZoomFactor);
        // The game will be resized when browser size change
        //cc.view.resizeWithBrowserSize(true);
        cc.loader.resPath = "res";
        //load resources
        if (typeof (g_resources) === "undefined")
        {
            cc.director.runScene(new GameScene());
        }
        else
        {
            cc.LoaderScene.preload(g_resources, function ()
            {
                cc.director.runScene(new GameScene());
            }, this);
        }
    }
});

var Game = IGame.extend("Game", {
    ctor:function()
    {
        this._super();
    }
})