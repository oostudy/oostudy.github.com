var BaseMap = cc.Layer.extend({
    ctor: function (mapData, from)
    {
        this._super();
        this._hero = null;
        this._name = mapData.name;
        this._bgm = mapData.bgm;
        this._bornPos = mapData.bornPos;
        this._triggers = mapData.triggers;
        this._npcs = [];

        //npc数据初始化
        for (var npcName in GNpcCfg)
        {
            var npcData = GNpcCfg[npcName];
            if (!cc.isUndefined(npcData.pos)
                && !cc.isUndefined(npcData.pos.map)
                && npcData.pos.map === this._name)
            {
                this._npcs.push(npcData)
            }
        }
    },

    onEnter: function ()
    {
        this._super();

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan.bind(this)
        }, this);

        this.scheduleUpdate();

        GTriggerMgr.initRegionTrigger(this._hero, this._triggers, this);
        //播放场景音乐
        GAudioTool.playMusic(this._bgm, true);
    },

    onExit: function ()
    {
        GTriggerMgr.clearRegionTrigger();
        this._super();
    },

    onTouchBegan: function (touch, event)
    {
        return true;
    },

    //地图滚动区，和触发器检查
    update: function (dt)
    {
        GTriggerMgr.check();
    },

    onTriggerIn: function (obj, trigger)
    {
        if (!trigger.to)
        {
            return;
        }
        if (cc.isObject(trigger.to))
        {
            GMapMgr.openMap(trigger.to, trigger.from);
            return;
        }
        else if (cc.isString(trigger.to))
        {
            GMapMgr.closeMap();
            var params = {};
            if (typeof trigger.params !== "undefined")
            {
                params = GHelper.clone(trigger.params);
            }
            GPageMgr.openPage(trigger.to, params);
            return;
        }
    }
});