var CardDnfMap = BaseMap.extend({
    ctor: function (mapData, from)
    {
        this._super(mapData);
        this._mapLayer = null;
        this._path = mapData.path;
        this._monsters = mapData.monsters || [];
        this._from = from;
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
        this._node_left = this._mapLayer.getChildByName("node_left");
        this._node_right = this._mapLayer.getChildByName("node_right");

        //左边阵营
        var left_role = GRoleMgr.createRole(GPlayerDataModel.getDefaultRoleDataModel());
        this._node_left.addChild(left_role);
        GBattleTool.addRole(left_role,ECamp.Left);

        //右边阵营
        cc.log("prepare to create monsters total=" + this._monsters.length);
        for (var i = 0, length = this._monsters.length; i < length; ++i)
        {
            var right_role = new MonsterRole(new RoleDataModel(this._monsters[i].baseData, this._monsters[i].extraData))
            this._node_right.addChild(right_role);
        }
    },

    onTouchBegan: function (touch, event)
    {
        return this._super(touch, event);
    },

    update: function (dt)
    {
        if (!this._hero)
        {
            return;
        }
        this._super(dt);
    },
});