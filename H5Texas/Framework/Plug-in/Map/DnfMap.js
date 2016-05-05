var DnfMap = BaseMap.extend({
    ctor: function (mapData, from)
    {
        this._super(mapData);
        this._mapLayer = null;
        this._path = mapData.path;
        this._width = 0;
        this.minY = mapData.minY;
        this.maxY = mapData.maxY;
        this.minX = mapData.minX;
        this.maxX = mapData.maxX;
        this._leftBornPos = mapData.leftBornPos;
        this._rightBornPos = mapData.rightBornPos;
        this._npcs = mapData.npcs || [];
        this._monsters = mapData.monsters || [];
        this._bosses = mapData.bosses || [];
        this._from = from;
        this._node_npc = null;
        this._node_dynamic = null;
    },

    onEnter: function ()
    {
        this._super();
        //创建场景地面
        this._mapLayer = ccs.load(this._path).node;

        if (!this._mapLayer)
        {
            cc.log(this._path + " loaded failed!");
            return;
        }

        this._width = this._mapLayer.getContentSize().width;
        this.addChild(this._mapLayer);
        this._node_npc = this._mapLayer.getChildByName("node_npc");
        this._node_dynamic = this._mapLayer.getChildByName("node_dynamic");

        //创建npc
        for (var i = 0; i < this._npcs.length; ++i)
        {
            this._node_npc.addChild(new NpcRole(this._npcs[i]));
        }


        //创建角色
        this._hero = GRoleMgr.createRole(GPlayerDataModel.getDefaultRoleDataModel());
        if (!this._from)
        {
            this._hero.setPosition(this._bornPos);
        }
        else if (this._from == "left")
        {
            this._hero.setPosition(this._rightBornPos);
        }
        else if (this._from == "right")
        {
            this._hero.setPosition(this._leftBornPos);
        }

        this._node_dynamic.addChild(this._hero);


        GBattleMgr.addHero(this._hero);

        //创建monster
        cc.log("prepare to create monsters total=" + this._monsters.length);
        for (var i = 0, length = this._monsters.length; i < length; ++i)
        {
            this._node_dynamic.addChild(GBattleMgr.createMonster(this._monsters[i]));
        }

        //创建monster
        for (var i = 0, length = this._bosses.length; i < length; ++i)
        {
            this._node_dynamic.addChild(GBattleMgr.createBoss(this._bosses[i]));
        }
    },

    onTouchBegan: function (touch, event)
    {
        var target = event.getCurrentTarget();
        var dstPos = target.convertToNodeSpace(touch.getLocation());
        if (this._hero)
        {
            if (dstPos.y < this.minY)
            {
                dstPos.y = this.minY;
            }
            if (dstPos.y > this.maxY)
            {
                dstPos.y = this.maxY;
            }
            this._hero.moveTo(dstPos);
        }
        return this._super(touch, event);
    },

    //地图滚动区，和触发器检查
    update: function (dt)
    {
        if (!this._hero)
        {
            return;
        }

        var hpos = this._hero.getPosition();

        var x = 0;
        if (hpos.x < cc.winSize.width / 2)
        {
            x = 0;
        }
        else if (this._width - hpos.x < cc.winSize.width / 2)
        {
            x = -(this._width - cc.winSize.width);
        }
        else
        {
            x = -(hpos.x - cc.winSize.width / 2);
        }
        this.setPositionX(x);
        GTriggerMgr.check();
        this._super(dt);
    },
});